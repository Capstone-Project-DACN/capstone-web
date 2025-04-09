import { AppDispatch } from "@/store/store";
import {
  Box,
  Pagination,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import { motion } from "framer-motion";
import { searchInactiveDevice } from "../../store/deviceSlice";
import { useNavigate } from "react-router";
import InactiveListItem from "../components/InactiveIListtem";
import InactiveDetail from "../components/InactiveDetail";

const StickyHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.default,
  zIndex: 10,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};
 
const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const InactiveTab = () => {
  const inactives = useSelector(
    (state: any) => state?.device?.deviceSlice?.inactiveData
  );
  const pagination = useSelector(
    (state: any) => state?.device?.deviceSlice.pagination
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const deviceId =
    new URLSearchParams(window.location.search).get("deviceId") || "";
  const page = new URLSearchParams(window.location.search).get("page") || 0;

  const handlePagination = (page: number) => {
    const updateParams = new URLSearchParams(window.location.search);
    updateParams.set("page", page.toString());
    navigate(`/device/inactive?${updateParams.toString()}`);
  };

  useEffect(() => {
    const fetchInactiveDevices = async () => {
      setLoading(true);
      try {
        const response: any = await dispatch(searchInactiveDevice({ pageNumber: page, pageSize: 20, dateTime: false }));
        const devices = response?.payload?.inactiveDevices ?? [];
        if (devices.length === 0) return;

        const matchedDevice = devices.find((item: any) => item.deviceId === deviceId);
        const selectedDeviceId = matchedDevice?.deviceId || devices[0].deviceId;
        const updateParams = new URLSearchParams(window.location.search);
        updateParams.set("deviceId", selectedDeviceId);
        navigate(`/device/inactive?${updateParams.toString()}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInactiveDevices();
  }, [page]);
  

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <div className="flex items-start h-full gap-x-3">
      <motion.div
        key="inactive"
        variants={tabVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-3/5 h-full overflow-y-scroll scrollbar-hide"
      >
        <StickyHeader className="border-t border-r border-l rounded-t-md">
          <motion.div
            className="flex items-center font-semibold justify-between h-12 px-4 text-blue-600 uppercase"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-1/10">Stt</div>
            <div className="w-2/5">Device ID</div>
            <div className="w-2/5">LastSeen</div>
          </motion.div>
        </StickyHeader>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {inactives?.map((item: any, index: number) => (
            <InactiveListItem currentDeviceId={deviceId} item={item} index={index} />
          ))}
        </motion.div>
        <div className="flex items-center justify-center my-5 mx-auto w-full">
          <Pagination
            count={pagination?.totalPages || 10}
            color="secondary"
            page={Number(pagination?.pageNumber || 1)}
            onChange={(e, page) => handlePagination(page)}
          />
        </div>
      </motion.div>

      <InactiveDetail />
    </div>
  );
};

export default InactiveTab;
