import { AppDispatch } from "@/store/store";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  IconButton,
  Typography,
  Chip,
  Tooltip,
  Box,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { searchAnomalyDetail } from "../store/anomalySlice";
import FuseLoading from "@fuse/core/FuseLoading";
import { motion, AnimatePresence } from "framer-motion";
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0,
    transition: { when: "afterChildren", staggerChildren: 0.01, staggerDirection: -1 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { y: -15, opacity: 0 }
};

const headerVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: -15 }
};

const getSeverityIcon = (severity) => {
  switch (severity?.toUpperCase()) {
    case 'HIGH':
      return <ErrorIcon color="error" fontSize="small"/>;
    case 'MEDIUM':
      return <WarningIcon color="warning" fontSize="small"/>;
    case 'LOW':
      return <InfoIcon color="info" fontSize="small"/>; 
    default:
      return <InfoIcon fontSize="small"/>;
  }
};

const getSeverityColor = (severity) => {
  switch (severity?.toUpperCase()) {
    case 'HIGH':
      return "error";
    case 'MEDIUM':
      return "warning";
    case 'LOW':
      return "info";
    default:
      return "default";
  }
};

const formatAreaId = (areaId) => {
  if (!areaId) return '';
  return areaId.replace('area_', '').replace(/_/g, ' ');
};

const AnomalyDetail = ({setRightSidebarOpen}) => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>(); 
  const [loading, setLoading] = useState(false);
  const detail = useSelector((state: any) => state.anomaly?.anomalySlice?.detail);
  const data = detail?.data;

  useEffect(() => {
    setLoading(true);
    dispatch(searchAnomalyDetail({ timestamp: params.id }))
      .then((response: any) => { 
        setTimeout(() => {
          setTimeout(() => {
            setLoading(false);
          }, 150);
        }, 350); 
      });
  }, [params.id, dispatch]);

  const handleBack = () => {
    navigate(`/anomaly/${params.tab}`);
    setRightSidebarOpen(false);
  };

  const severityColor = getSeverityColor(data?.severity);

  return (
    <div className="w-full h-full px-4 overflow-hidden">
      <motion.div
        className="flex justify-between items-center mb-2 sticky top-0 z-10 py-2"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex items-center mt-1">
          <IconButton onClick={handleBack} className="">
            <FuseSvgIcon className="text-7xl" size={22} color="action">
              heroicons-outline:arrow-left
            </FuseSvgIcon>
          </IconButton>
          <Typography className="font-semibold text-lg">
            Anomaly Detail
          </Typography>
        </div>
        <IconButton onClick={handleBack}>
          <FuseSvgIcon size={24} color="action">
            heroicons-outline:x-mark
          </FuseSvgIcon>
        </IconButton>
      </motion.div>

      <AnimatePresence>
        {loading ? (
          <FuseLoading />
        ) : (
          data && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-2"
            >
              <motion.div variants={itemVariants} className="mb-4">
                <Box
                  className="border-l-4 overflow-hidden"
                  style={{
                    borderLeftColor:
                      severityColor === "error"
                        ? "#f44336"
                        : severityColor === "warning"
                          ? "#ff9800"
                          : severityColor === "info"
                            ? "#2196f3"
                            : "#9e9e9e",
                  }}
                >
                  <Box className="flex justify-between items-center p-4">
                    <Typography className="text-lg font-medium">
                      {formatAreaId(data?.areaId) || data?.areaId}
                    </Typography>
                    <Tooltip title={`Severity: ${data?.severity}`}>
                      <Chip
                        icon={getSeverityIcon(data?.severity)}
                        label={data?.severity}
                        color={severityColor as any}
                        size="small"
                      />
                    </Tooltip>
                  </Box>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box className="mb-4 text-red-600">{data?.message}</Box>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-lg p-3 mb-4 flex items-center gap-x-2"
              >
                <FuseSvgIcon className="text-7xl" size={22} color="action">
                  heroicons-outline:bell-alert
                </FuseSvgIcon>
                <div>
                  <Typography variant="body2" className="text-gray-500">
                    Timestamp
                  </Typography>
                  <Typography variant="body1">
                    {new Date(data?.timestamp).toLocaleString()}
                  </Typography>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-4 px-2">
                <Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      className="font-medium mb-2"
                    >
                      Meter Values
                    </Typography>
                    <Divider className="mb-3" />

                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      variants={containerVariants}
                    >
                      <motion.div
                        variants={itemVariants}
                        className="p-1 px-3 rounded-lg"
                      >
                        <Typography
                          variant="body2"
                          className="mb-1"
                          color="text.secondary"
                        >
                          Area Meter Total
                        </Typography>
                        <Typography
                          variant="h6"
                          className="font-medium text-blue-700"
                        >
                          {data?.areaMeterTotal !== undefined
                            ? `${data.areaMeterTotal.toFixed(2)} kWh`
                            : "N/A"}
                        </Typography>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="p-1 px-3 rounded-lg"
                      >
                        <Typography
                          variant="body2"
                          className="mb-1"
                          color="text.secondary"
                        >
                          Household Meter Total
                        </Typography>
                        <Typography
                          variant="h6"
                          className="font-medium text-blue-700"
                        >
                          {data?.householdMeterTotal !== undefined
                            ? `${data.householdMeterTotal.toFixed(2)} kWh`
                            : "N/A"}
                        </Typography>
                      </motion.div>
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-4 px-2">
                <Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      className="font-medium mb-2"
                    >
                      Difference Analysis
                    </Typography>
                    <Divider className="mb-3" />

                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      variants={containerVariants}
                    >
                      <motion.div
                        variants={itemVariants}
                        className="p-1 px-3 rounded-lg"
                      >
                        <Typography
                          variant="body2"
                          className="mb-1"
                          color="text.secondary"
                        >
                          Absolute Difference
                        </Typography>
                        <Typography
                          variant="h6"
                          className="font-medium text-red-600"
                        >
                          {data?.difference !== undefined
                            ? `${data.difference.toFixed(2)} kWh`
                            : "N/A"}
                        </Typography>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="p-1 px-3 rounded-lg"
                      >
                        <Typography
                          variant="body2"
                          className="mb-1"
                          color="text.secondary"
                        >
                          Percentage Difference
                        </Typography>
                        <Typography
                          variant="h6"
                          className="font-medium text-red-600"
                        >
                          {data?.percentageDifference !== null &&
                          data?.percentageDifference !== undefined
                            ? `${data.percentageDifference.toFixed(2)}%`
                            : "N/A"}
                        </Typography>
                      </motion.div>
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-4 px-2">
                <Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      className="font-medium mb-2"
                    >
                      Analysis Information
                    </Typography>
                    <Divider className="mb-3" />

                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      variants={containerVariants}
                    >
                      <motion.div
                        variants={itemVariants}
                        className="p-1 px-3 rounded-lg"
                      >
                        <Typography
                          variant="body2"
                          className="mb-1"
                          color="text.secondary"
                        >
                          Analysis Type
                        </Typography>
                        <Typography variant="h6" className="font-medium">
                          {data?.analysisType || "N/A"}
                        </Typography>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="p-1 px-3 rounded-lg"
                      >
                        <Typography
                          variant="body2"
                          className="mb-1"
                          color="text.secondary"
                        >
                          Window Size
                        </Typography>
                        <Typography variant="h6" className="font-medium">
                          {data?.windowSize !== null &&
                          data?.windowSize !== undefined
                            ? data.windowSize
                            : "N/A"}
                        </Typography>
                      </motion.div>
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>

              <motion.div
                className="bg-gray-100 rounded-lg mt-6 bg-transparent px-2 mb-5"
                variants={itemVariants}
              >
                <Box
                  className="flex border rounded-md p-4 border-gray-500 flex-col gap-y-2"
                  sx={{ mt: 1, mb: 0 }}
                >
                  <Typography variant="body2">
                    areaId: <code>{data?.areaId}</code>
                  </Typography>
                  <Typography variant="body2">
                    severity: <code>{data?.severity}</code>
                  </Typography>
                  <Typography variant="body2">
                    timestamp:{" "}
                    <code>
                      {data?.timestamp},{" "}
                      {new Date(data?.timestamp).toLocaleString()}
                    </code>
                  </Typography>
                  <Typography variant="body2">
                    percentageDifference:{" "}
                    <code>{data?.percentageDifference} </code>
                  </Typography>
                  <Typography variant="body2">
                    difference: <code>{data?.difference} </code>
                  </Typography>
                  <Typography variant="body2">
                    windowSize: <code>{data?.windowSize} </code>
                  </Typography>
                  <Typography variant="body2">
                    areaMeterTotal: <code>{data?.areaMeterTotal} </code>
                  </Typography>
                  <Typography variant="body2">
                    householdMeterTotal:{" "}
                    <code>{data?.householdMeterTotal} </code>
                  </Typography>
                  <Typography variant="body2">
                    analysisType: <code>{data?.analysisType} </code>
                  </Typography>
                  <Typography variant="body2">
                    message: <code>{data?.message}</code>
                  </Typography>
                </Box>
              </motion.div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnomalyDetail;