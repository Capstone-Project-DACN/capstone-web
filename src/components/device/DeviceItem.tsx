import {
  Box,
  Typography,
  Card,
  CardContent,
  Tooltip,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BoltIcon from "@mui/icons-material/Bolt";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeviceOption from "@/components/device/DeviceOption";
import { formatTimestampToDate, timeDifferenceLocalized } from "@/utils/helper";

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

const DeviceItem = ({ device }) => {
  const formatTimestamp = (timestamp: any) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    

    <motion.div
      key={device.deviceId}
      variants={itemVariants}
      whileHover={{
        backgroundColor: "rgba(0,0,0,0.03)",
        scale: 1.0005,
        transition: { duration: 0.15 },
      }}
      className="flex items-center font-normal justify-between h-15 px-4 border-b border-r border-l"
    >
      <div className="w-2/12 pl-2">Device {device.id}</div>
      <div className="w-2/12">
        <Typography variant="body2">
         {device.electricity_usage_kwh.toFixed(2)} kWh
        </Typography>
      </div>
      <div className="w-3/12">
        <Typography variant="body2">
            {formatTimestamp(device.last_seen)}
        </Typography>
      </div>
      <div className="w-2/12">
        <Typography variant="body2">
           {device.current} A
        </Typography>
      </div>
      <div className="w-3/12 flex items-center justify-between">
        <Typography variant="body2">
            {device.voltage} V
        </Typography>
        <DeviceOption device={device} />
      </div>
    </motion.div>
  );
};

export default DeviceItem;
