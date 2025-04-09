import { AppDispatch } from "@/store/store";
import {
  Box,
  Chip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import { motion } from "framer-motion";
import {  timeDifferenceLocalized } from "@/utils/helper";
import { getDeviceDetail } from "../../store/deviceSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import InfoIcon from "@mui/icons-material/Info";

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

const InactiveDetail = (props: any) => {
  const deviceDetail = useSelector((state: any) => state?.device?.deviceSlice.detail);
  const dispatch = useDispatch<AppDispatch>();
  const [detailLoading, setDetailLoading] = useState(false);
  const deviceId = new URLSearchParams(window.location.search).get("deviceId") || "";

  useEffect(() => {
    if (deviceId === "") return;
    setDetailLoading(true);
    dispatch(getDeviceDetail({ deviceId })).then((response: any) => {
      setDetailLoading(false);
    });
  }, [deviceId]);

  if (deviceId !== "" && detailLoading && !deviceDetail) return <FuseLoading />;

  return (
    <div className="w-2/5 h-full overflow-y-scroll scrollbar-hide">
        <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="mt-2 mb-6 px-3"
        >
        <motion.div variants={itemVariants} className="mb-6">
            <Box
            className="border-l-4 rounded-r-lg overflow-hidden"
            style={{
                borderLeftColor: "#2196f3",
            }}
            >
            <Box className="flex justify-between items-center p-4">
                <Typography className="text-lg font-medium">{deviceId}</Typography>
                <Chip
                icon={<InfoIcon color="info" fontSize="small" />}
                label={deviceDetail?.type}
                color="info"
                size="small"
                />
            </Box>
            </Box>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
            <Typography className="mb-2 font-medium text-lg">
                Status Information
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Last seen info */}
            <div className=" rounded-lg p-4 flex items-start gap-x-3 border-b transition">
                <FuseSvgIcon className="" size={22}>
                heroicons-outline:clock
                </FuseSvgIcon>
                <div>
                <Typography variant="body2" className=" ">
                    Last seen
                </Typography>
                <Typography variant="body1" className="">
                    {timeDifferenceLocalized(Number(deviceDetail?.last_seen))}
                </Typography>
                </div>
            </div>

            <div className="  rounded-lg p-4 flex items-start gap-x-3 border-b transition">
                <FuseSvgIcon className="text-green-500" size={22}>
                heroicons-outline:calendar
                </FuseSvgIcon>
                <div>
                <Typography variant="body2" className=" ">
                    Created at
                </Typography>
                <Typography variant="body1" className="font-medium">
                    {timeDifferenceLocalized(Number(deviceDetail?.created_at))}
                </Typography>
                </div>
            </div>
            </div>
        </motion.div>

        <motion.div variants={itemVariants}>
            <Typography className="mb-2 font-medium text-lg">
                Electrical Metrics
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg p-4 flex w-full gap-x-3 border-b transition">
                <FuseSvgIcon className="text-7xl" size={22} color="action">
                    heroicons-outline:arrow-trending-up
                </FuseSvgIcon>
                <div>
                <Typography variant="body2" className=" ">
                    Voltage
                </Typography>
                <Typography variant="body1" className="font-medium">
                    {Number(deviceDetail?.voltage).toFixed(2)} V
                </Typography>
                </div>
            </div>

            <div className=" rounded-lg p-4 flex items-center gap-x-3 border-b transition">
                <FuseSvgIcon className="text-7xl" size={22} color="action">
                heroicons-outline:sparkles
                </FuseSvgIcon>
                <div>
                <Typography variant="body2" className=" ">
                    Current
                </Typography>
                <Typography variant="body1" className="font-medium">
                    {Number(deviceDetail?.current).toFixed(2)} A
                </Typography>
                </div>
            </div>
            </div>

            <div className=" rounded-lg p-4 flex items-center gap-x-3 border-b mt-4 transition">
            <FuseSvgIcon className="text-red-500" size={22}>
                heroicons-outline:light-bulb
            </FuseSvgIcon>
            <div>
                <Typography variant="body2" className=" ">
                Electricity Usage
                </Typography>
                <Typography variant="body1" className="font-medium">
                    {Number(deviceDetail?.electricity_usage_kwh).toFixed(2)} kWh
                </Typography>
            </div>
            </div>
        </motion.div>
        </motion.div>
    </div>
  );
};

export default InactiveDetail;
