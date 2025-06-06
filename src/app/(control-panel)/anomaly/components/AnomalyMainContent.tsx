import { AppDispatch } from "@/store/store";
import { Box, styled, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { searchAnomaly } from "../store/anomalySlice";
import FuseLoading from "@fuse/core/FuseLoading";
import { motion, AnimatePresence } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import AnomalySettingsTab from "./AnomalySettingsTab";
import { useMediaQuery } from "@mui/system";
import { useThemeMediaQuery } from "@fuse/hooks";

const StickyHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.default,
  zIndex: 10,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
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

const AnomalyMainContent = () => {
  const params = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('sm'));
  const anomalies = useSelector(
    (state: any) => state?.anomaly?.anomalySlice?.data
  );
  const settingData = useSelector(
    (state: any) => state?.anomaly?.anomalySlice?.settings
  );
  const dispatch = useDispatch<AppDispatch>();
  const timestamp = new URLSearchParams(window.location.search).get(
    "timestamp"
  );
  const [loading, setLoading] = useState(false);

  const handleCliclItem = (item: any) => {
    const id = item?.deviceId || item?.areaId;
    navigate(`/anomaly/${params?.tab}/${id}?timestamp=${item?.timestamp}`);
  };

  useEffect(() => {
    setLoading(true);
    const filterType =
      params.tab === "district"
        ? "districts"
        : params.tab === "device"
          ? "devices"
          : "";
    dispatch(searchAnomaly({ type: filterType })).then(() => {
      setLoading(false);
    });
  }, [params.tab]);

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="popLayout">
        {params.tab !== "setting" ? (
          <motion.div
            key="inactive"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-w-[1000px] overflow-x-scroll px-2 md:px-0"
          >
            <StickyHeader className="rounded-t-lg overflow-hidden">
              <motion.div
                className="flex items-center rounded-t-md font-semibold justify-between h-12 px-4 text-blue-600 uppercase"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-1/15">Stt</div>
                <div className="w-3/15">Device ID</div>
                <div className="w-2/10">Difference</div>
                <div className="w-1/10">Severity</div>
                <div className="w-3/10">Message</div>
                <div className="w-2/10">Date (time)</div>
              </motion.div>
            </StickyHeader>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {anomalies?.map((item: any, index: number) => (
                <motion.div
                  key={item.deviceId || index}
                  variants={itemVariants}
                  whileHover={{
                    backgroundColor: "rgba(0,0,0,0.03)",
                    scale: 1.00005,
                    transition: { duration: 0.15 },
                  }}
                >
                  <Box
                    className="flex items-center font-normal justify-between h-16 px-4 border-b border-r border-l cursor-pointer"
                    onClick={() => handleCliclItem(item)}
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      backgroundColor:
                        String(item?.timestamp) === String(timestamp)
                          ? theme.palette.action.hover
                          : "",
                    }}
                  >
                    <div className="w-1/15 pl-2">{index}</div>
                    <div className="w-3/15 flex items-center gap-x-2">
                      {item?.typeof === "DEVICE" && (
                        <FuseSvgIcon
                          className="text-7xl"
                          size={18}
                          color={"info"}
                        >
                          heroicons-outline:building-office
                        </FuseSvgIcon>
                      )}

                      {item?.typeof === "AREA" && (
                        <FuseSvgIcon
                          className="text-7xl"
                          size={18}
                          color={"info"}
                        >
                          heroicons-outline:globe-asia-australia
                        </FuseSvgIcon>
                      )}

                      <Typography className="text-md font-semibold">
                        {item?.deviceId || item.areaId}
                      </Typography>
                    </div>
                    <div className="w-2/10 flex gap-x-3">
                      <Typography>{item?.difference?.toFixed(2)}</Typography>
                      {item?.percentageDifference && (
                        <Typography
                          className={`${Math.abs(item.difference) > 50 ? "text-red-500" : "text-green-500"}`}
                        >
                          ({item?.percentageDifference?.toFixed(2)}%)
                        </Typography>
                      )}
                    </div>
                    <div className="w-1/10 capitalize">{item.severity}</div>
                    <div className="w-3/10 line-clamp-2 trucate pr-5 font-semibold">
                      {item.message}
                    </div>
                    <div className="w-2/10">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </Box>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <AnomalySettingsTab />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnomalyMainContent;
