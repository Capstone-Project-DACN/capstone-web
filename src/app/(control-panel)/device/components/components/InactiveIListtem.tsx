import {
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { timeDifferenceLocalized } from "@/utils/helper";
import { useNavigate } from "react-router";

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

const InactiveListItem = ({ item, index, currentDeviceId }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const handleClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const updatedParams = new URLSearchParams(window.location.search);
        updatedParams.set("deviceId", item?.deviceId);
        navigate(`/device/inactive?${updatedParams.toString()}`);
    };

    return <>
        <motion.div
            key={item.deviceId || index}
            variants={itemVariants}
            whileHover={{
            backgroundColor: theme.palette.action.hover,
            scale: 1.0005,
            transition: { duration: 0.15 },
            }}
        >
            <Box
            sx={{
                "&:hover": { backgroundColor: theme.palette.action.hover },
                backgroundColor: item.deviceId == currentDeviceId ? theme.palette.action.hover : "",
            }}
            onClick={handleClick}
            className="flex items-center font-normal cursor-pointer justify-between h-15 px-4 border-b border-r border-l"
            >
              <Typography className="w-1/10 pl-2">{index}</Typography>
              <Typography className="w-2/5">{item.deviceId}</Typography>
              <Typography className="w-2/5 ">{timeDifferenceLocalized(item?.lastSeen)}</Typography>
            </Box>
        </motion.div>
    </>;
};

export default InactiveListItem;