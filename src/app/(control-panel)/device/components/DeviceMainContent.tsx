import { AppDispatch } from "@/store/store";
import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { searchInactiveDevice } from "../store/deviceSlice";
import FuseLoading from "@fuse/core/FuseLoading";
import { motion, AnimatePresence } from "framer-motion";
import { formatTimestampToDate, timeDifferenceLocalized } from "@/utils/helper";

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
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2
    }
  }
};

const DeviceMainContent = () => {
  const params = useParams();
  const inactives = useSelector((state: any) => state?.device?.deviceSlice?.data);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(searchInactiveDevice({ pageNumber: 1, pageSize: 20, dateTime: true }))
      .then((response: any) => { setLoading(false); });
  }, []);

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
      <AnimatePresence mode="wait">
        {params.tab === "inactive" && (
          <motion.div 
            key="inactive"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className=""
          >
            <StickyHeader>
              <motion.div 
                className="flex items-center font-semibold justify-between h-12 px-4 text-blue-600 uppercase"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-1/3">Device ID</div>
                <div className="w-1/3">Created at</div>
                <div className="w-1/3">LastSeen</div>
              </motion.div>
            </StickyHeader>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {inactives?.map((item: any, index: number) => (
                <motion.div
                  key={item.deviceId || index}
                  variants={itemVariants}
                  whileHover={{ 
                    backgroundColor: "rgba(0,0,0,0.03)", 
                    scale: 1.0005,
                    transition: { duration: 0.15 }
                  }}
                  className="flex items-center font-semibold justify-between h-12 px-4 border-b border-r border-l"
                >
                  <div className="w-1/3">{item.deviceId}</div>
                  <div className="w-1/3">{new Date().toLocaleString()}</div>
                  <div className="w-1/3">{(formatTimestampToDate(item.lastSeen))}{ " " }({timeDifferenceLocalized(item.lastSeen)})</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
        
        {params.tab === "overview" && (
          <motion.div
            key="districts"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Overview
          </motion.div>
        )}

        {params.tab === "districts" && (
          <motion.div
            key="districts"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Districts
          </motion.div>
        )}
        
        {/* Note: You have a duplicate "inactive" condition in your original code */}
        {params.tab === "inactive"  && (
          <motion.div
            key="inactive-duplicate"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Inactive
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DeviceMainContent;