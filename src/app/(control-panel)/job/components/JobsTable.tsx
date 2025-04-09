import {
  Box,
  Typography,
  Chip,
  styled,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { getCronJobs } from "../store/jobSlice";
import JobItem from "./JobItem";
import DeviceOption from "@/app/(control-panel)/device/components/components/DeviceOption";

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

const StickyHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.default,
  zIndex: 10,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
}));

const JobsTable = (props: any) => {
 
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const data = useSelector((state: any) => state?.jobs?.jobSlice?.data || []);

  useEffect(() => {
    setLoading(true);
    dispatch(getCronJobs({})).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;
    const upperSearch = searchText.toUpperCase();

    return data.filter((item: any) =>
      `${item.cron_type}-${item.city_id}-${item.district_id}-${item.status}`
        .toUpperCase()
        .includes(upperSearch)
    );
  }, [data, searchText]);

  return (
    <div className="w-full h-full flex flex-col px-5">
      <div className="flex mt-3 top-0 items-stretch pt-1 mb-4 w-full">
        <TextField
          id="outlined-basic"
          autoComplete="off"
          label="Search all"
          sx={{
            "& .MuiOutlinedInput-root": {
              paddingTop: "0px",
            },
          }}
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full rounded-sm border-none"
        />
        <Button
          variant="contained"
          className="rounded-sm ml-2"
          sx={{ backgroundColor: theme.palette.action.hover }}
        >
          <FuseSvgIcon className="text-7xl" size={22} color="action">
            heroicons-outline:magnifying-glass
          </FuseSvgIcon>
        </Button>
      </div>
      <motion.div
        key="districts"
        variants={tabVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="h-full rounded-md overflow-y-auto scrollbar-hide flex justify-between gap-x-5 relative"
      >
        <Box className="flex items-center justify-between mb-4 w-full h-full">
          {loading ? (
            <FuseLoading />
          ) : (
            <AnimatePresence>
              <motion.div
                key="inactive"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full h-full overflow-y-auto scrollbar-hide"
              >
                <StickyHeader className="border-t border-r border-l rounded-t-md">
                  <motion.div
                    className="flex items-center font-semibold justify-between h-12 px-4 text-blue-600 uppercase"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-3/10 pl-2">CRON TYPE</div>
                    <div className="w-2/10">CITY ID</div>
                    <div className="w-2/10">DISTRICT ID</div>
                    <div className="w-2/10">STATUS</div>
                    <div className="w-1/10">ACTION</div>
                  </motion.div>
                </StickyHeader>

                <Box>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col"
                  >
                    {filteredData?.map((job: any, index: any) => (
                      <JobItem
                        job={job}
                        index={index}
                     
                      ></JobItem>
                    ))}
                  </motion.div>
                </Box>
              </motion.div>
            </AnimatePresence>
          )}
        </Box>
      </motion.div>
    </div>
  );
};

export default JobsTable;
