import { useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import SettingsTab from "./components/SettingsTab";
import InactiveTab from "./components/InactiveTab";
import OverviewTab from "./components/OverviewTab";

const DeviceMainContent = () => {
  const params = useParams();

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="popLayout">
        {params.tab === "overview" && <OverviewTab />}

        {params.tab === "inactive" && <InactiveTab />}

        {params.tab === "setting" && <SettingsTab />}
      </AnimatePresence>
    </motion.div>
  );
};

export default DeviceMainContent;