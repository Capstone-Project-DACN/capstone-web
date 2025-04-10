import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { add } from "lodash";
import { addSelectedDevice, removeDevice, removeSelectedDevice } from "../../store/deviceSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

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

const DeviceOption = ({ device,  isSelected = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState(null);
  const topic = new URLSearchParams(window.location.search).get("topic") || "";

  const handleMenuClick = (event: any, device: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFollowDevice = () => {
    console.log({device});
    if(!isSelected) dispatch(addSelectedDevice(device?.device_id));
    else dispatch(removeSelectedDevice(device?.device_id));
    handleMenuClose();
  };

  const handleDeleteDevice = () => {
    dispatch(removeDevice({ deviceId: device?.device_id , topic})).then((response: any) => {
      handleMenuClose();
      dispatch(showMessage({message: "Delete device successfully", variant: "success", anchorOrigin: {vertical: "top", horizontal: "right"}}));
    }).catch((error: any) => {
      dispatch(showMessage({message: "Error deleting device", variant: "error", anchorOrigin: {vertical: "top", horizontal: "right"}}));
    }) 
  };

  return (
    <motion.div
      key="districts"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-4"
    >
      <IconButton size="small" onClick={(e) => handleMenuClick(e, device)}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleFollowDevice} sx={{ color: "primary.main" }}>
          {isSelected ? (
            <div className="flex items-center gap-x-2">
              <FuseSvgIcon className="text-7xl" size={18}>
                heroicons-solid:signal-slash
              </FuseSvgIcon>
              Stop Produce
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <FuseSvgIcon className="text-7xl" size={18}>
                heroicons-solid:signal
              </FuseSvgIcon>
              Produce data
            </div>
          )}
        </MenuItem>
        <MenuItem onClick={handleDeleteDevice} sx={{ color: "error.main" }}>
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          Remove Device
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default DeviceOption;
