import { motion, AnimatePresence } from "framer-motion";
import InactiveTab from "./components/tabs/InactiveTab";
import OverviewTab from "./components/tabs/OverviewTab";
import AddDeviceTab from "./components/tabs/AddDeviceTab";
import { useSelector } from "react-redux";
import ProduceTab from "./components/tabs/ProduceTab";

const DeviceContent = () => {
  const tab = useSelector((state: any) => state?.device?.deviceSlice?.tab);

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="popLayout">
        {tab === "overview" && <OverviewTab />}

        {tab === "inactive"  && <InactiveTab />}
        
        {tab === "produce"  && <ProduceTab />}

        {tab === "add-device"  && <AddDeviceTab />}
      </AnimatePresence>
    </motion.div>
  );
};

export default DeviceContent;