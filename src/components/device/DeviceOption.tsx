import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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

const DeviceOption = ({ device }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeDevice, setActiveDevice] = useState(false);

  const handleMenuClick = (event: any, device: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFollowDevice = () => {};
  const handleDeleteDevice = () => {};

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
        <MenuItem onClick={handleFollowDevice}>
          {activeDevice ? (
            <>
              <FavoriteIcon fontSize="small" sx={{ mr: 1 }} />
              Unfollow Device
            </>
          ) : (
            <>
              <FavoriteBorderIcon fontSize="small" sx={{ mr: 1 }} />
              Follow Device
            </>
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
