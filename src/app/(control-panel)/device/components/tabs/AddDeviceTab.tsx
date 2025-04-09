import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import AddDevice from "../components/AddDevice";

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

const AddDeviceTab = () => {
  return (
    <motion.div
      key="settings"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col md:flex-row items-start justify-center gap-4 p-4"
    >
      <Box
        className="w-full shadow-none md:w-2/5 p-4"
        sx={{ backgroundColor: "background.default" }}
      >
        <Typography variant="subtitle1" className="font-semibold mb-3">
          ⚡ Notes:
        </Typography>
        <pre className="p-3 rounded-lg overflow-x-auto">
          <code>
            {`Device ID Configuration Notes

🏙️ Target Cities
    - HCMC: Ho Chi Minh City
    - TDUC: Thu Duc City
    - subLocation = Districts (e.g., Q1, Q5, Q7...)

🆔 Device ID Format
    - Area: area-[city]-[district]
    - Household: household-[city]-[district]-[id]
    - Anomaly: household-[city]-[district]-[id]
    - Example: household-HCMC-Q5-123

🔢 Device ID Range
    - ID range per district: 0–999
    - Max 1000 devices per district

📌 Data Types
    - household: residential data
    - area: geographical metrics
    - errors: system error logs
    - performance: system metrics
`}
          </code>
        </pre>
      </Box>

      <Box className="w-full md:w-3/5 px-6 shadow-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <AddDevice />
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default AddDeviceTab;
