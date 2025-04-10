import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import DeviceOption from "@/app/(control-panel)/device/components/components/DeviceOption";
import { timeDifferenceLocalized } from "@/utils/helper";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

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

const DeviceListItem = ({ device, isSelected = false }) => {

  return (
    <motion.div
      key={device.device_id}
      variants={itemVariants}
      whileHover={{
        backgroundColor: "rgba(0,0,0,0.03)",
        scale: 1.0005,
        transition: { duration: 0.15 },
      }}
      className="flex items-center relative font-normal justify-between h-15 px-4 border-b border-r border-l"
    >
      <Typography className="w-3/12 pl-2 line-clamp-1 trucate">
        {device?.device_id}
      </Typography>
      <div className="w-2/12">
        <Typography variant="body2">
          {device?.value?.electricity_usage_kwh
            ? `${Number(device?.value?.electricity_usage_kwh).toFixed(2)} kWh`
            : "-"}
        </Typography>
      </div>
      <div className="w-2/12">
        <Typography variant="body2" className="">
          {}
          <Typography variant="body2">
            {device?.value?.last_seen
              ? timeDifferenceLocalized(Number(device?.value?.last_seen))
              : "-"}
          </Typography>
        </Typography>
      </div>
      <div className="w-2/12">
        <Typography variant="body2">
          {device?.value?.current
            ? `${Number(device?.value?.current).toFixed(2)} A`
            : "-"}
        </Typography>
      </div>
      <div className="w-2/12 flex items-center justify-between">
        <Typography variant="body2">
          {device?.value?.voltage
            ? `${Number(device?.value?.voltage).toFixed(2)} V`
            : "-"}
        </Typography>
        <DeviceOption device={device} isSelected={isSelected} />
      </div>

      {isSelected && <div className="absolute right-3 top-5">
        <FuseSvgIcon className="text-7xl" size={18} color="primary">
          heroicons-solid:signal
        </FuseSvgIcon>
      </div>}
    </motion.div>
  );
};

export default DeviceListItem;
