import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Select,
    Slider,
    Typography,
    Paper,
    Tooltip,
    IconButton,
  } from "@mui/material";
  import { motion } from "framer-motion";
  import { useState } from "react";
  import InfoIcon from '@mui/icons-material/Info';
  import SaveIcon from '@mui/icons-material/Save';
  
  const distributionMethods = ["Random", "Round-robin", "Custom"];
  const dataTypes = ["household", "area", "errors", "performance"];
  
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
  
  const SettingsTab = () => {
    const [cronTime, setCronTime] = useState("*/5 * * * *"); // Default every 5 minutes
    const [distribution, setDistribution] = useState("Random");
    const [batchSize, setBatchSize] = useState(10);
    const [selectedDataTypes, setSelectedDataTypes] = useState(["household"]);
  
    return (
      <motion.div
        key="settings"
        variants={tabVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col md:flex-row items-start justify-center gap-4 p-4"
      >
        <Box className="w-full shadow-none md:w-2/5 p-4 bg-gray-50">
          <Typography variant="subtitle1" className="font-semibold mb-3">⚡ Notes:</Typography>
          <pre className="p-3 rounded-lg overflow-x-auto">
            <code>
  {`Data Sending Configuration Guide
  ⏳ Sending Time (Cron)
     - Controls frequency of data transmission
     - Format: */interval * * * *
     - Examples: */5 * * * * (5 min)
  
  📊 Distribution Method
     - Random: sends to random endpoints
     - Round-robin: sequential distribution
     - Custom: user-defined rules
  
  📦 Batch Size
     - Range: 1-50 data points per batch
     - Smaller: faster, less efficient
     - Larger: slower, more efficient
  
  📌 Data Types
     - household: residential data
     - area: geographical metrics
     - errors: system error logs
     - performance: system metrics
  
  💾 Save Configuration
     - Persists settings to database
     - Required before changes take effect`}
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
            <Typography variant="h5" className="font-semibold text-lg flex items-center">
              Data Sending Configuration
              <Tooltip title="Configure how data will be sent to servers">
                <IconButton size="small" className="ml-2">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
  
            <FormControl fullWidth>
              <Typography className="mb-2 font-medium flex items-center">
                ⏳ Sending Time (Cron)
              </Typography>
              <Select
                value={cronTime}
                onChange={(e) => setCronTime(e.target.value)}
                className="rounded-sm"
              >
                <MenuItem value="*/5 * * * *">Every 5 minutes</MenuItem>
                <MenuItem value="*/10 * * * *">Every 10 minutes</MenuItem>
                <MenuItem value="*/30 * * * *">Every 30 minutes</MenuItem>
                <MenuItem value="0 * * * *">Every hour</MenuItem>
                <MenuItem value="*/10 * * * * *">Every 10 seconds</MenuItem>
                <MenuItem value="*/30 * * * * *">Every 30 seconds</MenuItem>
                <MenuItem value="*/45 * * * * *">Every 45 seconds</MenuItem>
              </Select>
            </FormControl>
  
            <FormControl fullWidth>
              <Typography className="mb-2 font-medium flex items-center">
                📊 Distribution Method
              </Typography>
              <Select
                value={distribution}
                onChange={(e) => setDistribution(e.target.value)}
                className="rounded-sm"
              >
                {distributionMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
  
            <Box className="mt-1">
              <Typography className="font-medium flex items-center mb-2">
                📦 Batch Size: <span className="ml-2 font-bold">{batchSize}</span>
              </Typography>
              <Slider
                value={batchSize}
                min={1}
                max={50}
                step={1}
                onChange={(_, newValue: any) => setBatchSize(newValue)}
                valueLabelDisplay="auto"
                color="primary"
              />
            </Box>
  
            <FormControl fullWidth>
              <Typography className="mb-2 font-medium flex items-center">
                📌 Select Data Types
              </Typography>
              <Select
                multiple
                value={selectedDataTypes}
                onChange={(e: any) => setSelectedDataTypes(e.target.value)}
                className="rounded-sm"
                renderValue={(selected) => selected.join(', ')}
              >
                {dataTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
  
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<SaveIcon />}
              className="mt-4 rounded-sm hover:shadow-lg transition-all"
              fullWidth
            >
              Save Configuration
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    );
  };
  
  export default SettingsTab;