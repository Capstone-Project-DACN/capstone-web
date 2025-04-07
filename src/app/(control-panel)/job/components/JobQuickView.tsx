import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AppDispatch } from "@/store/store";
import SensorsOffTwoToneIcon from "@mui/icons-material/SensorsOffTwoTone";
import SensorsIcon from "@mui/icons-material/Sensors";
import { getJobDetail, updateJobStatus } from "../store/jobSlice";
import {
  convertMillisecondsToTimeUnit,
  cronToMilliseconds,
  millisecondsToCron,
} from "@/utils/helper";
import InfoIcon from "@mui/icons-material/Info";
import ApiRoundedIcon from "@mui/icons-material/ApiRounded";
import { yupResolver } from "@hookform/resolvers/yup";
import FuseLoading from "@fuse/core/FuseLoading";
import DistributedChart from "./DistributedChart";

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { y: -15, opacity: 0 },
};

// Constants
const DISTRIBUTION_OPTIONS = [
  "Bell Curve",
  "Uniform",
  "Linear",
  "Bimodal",
  "Multimodal",
  "Exponential",
];

const validationSchema = yup.object().shape({
  cron_time: yup
    .number()
    .typeError("Must be a number")
    .positive("Must be positive")
    .required("Required"),
  distribution_type: yup.string().required("Distribution type is required"),
});

interface JobQuickViewProps {
  setRightSidebarOpen: (isOpen: boolean) => void;
}

const JobQuickView: React.FC<JobQuickViewProps> = ({ setRightSidebarOpen }) => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const jobQuickViewId = searchParams.get("jobQuickView");
  const dispatch = useDispatch<AppDispatch>();
  const jobDetail = useSelector((state: any) => state?.jobs?.jobSlice?.detail);
  const [loading, setLoading] = useState(false);
  const [saveEnable, setSaveEnable] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const primaryColor = jobDetail?.status === "running" ? "info" : "error";

  const {
    control,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      distribution_type: "",
      cron_time: "",
      random_order: false,
      ...jobDetail,
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  // Watch cron_time for live updates
  const msValue = watch("cron_time");
  const parsedMs = parseInt(msValue?.toString());
  const msValid = !isNaN(parsedMs) && parsedMs > 0;
  const detailed = msValid ? convertMillisecondsToTimeUnit(parsedMs) : null;
  const cronExpr = parsedMs % 1000 === 0 ? millisecondsToCron(parsedMs) : "";

  // Load job details when ID changes
  useEffect(() => {
    if (jobQuickViewId) {
      setLoading(true);
      dispatch(getJobDetail({ id: jobQuickViewId }))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [jobQuickViewId, dispatch]);

  useEffect(() => {
    if (jobDetail) {
      reset({
        ...jobDetail,
        cron_time: cronToMilliseconds(jobDetail.cron_time),
      });
    }
  }, [jobDetail, reset]);

  // Toggle job status
  const updateStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setUpdateLoading(true);

    const newStatus = jobDetail.status === "stopped" ? "running" : "stopped";

    dispatch(
      updateJobStatus({
        id: jobQuickViewId,
        status: newStatus,
      })
    ).finally(() => setUpdateLoading(false));
  };

  // Submit form updates
  const handleJobSubmit = async (data: any) => {
    setUpdateLoading(true);
    try {
      setTimeout(() => {
        setUpdateLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating job:", error);
      setUpdateLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/cronjob`);
    setRightSidebarOpen(false);
  };

  if (loading) {
    return <FuseLoading />;
  }

  if (!jobDetail) {
    return (
      <Box className="p-4 text-center">
        <Typography variant="h6">Job not found</Typography>
        <Button onClick={handleBack} variant="outlined" className="mt-4">
          Back to Jobs
        </Button>
      </Box>
    );
  }

  return (
    <div className="px-4 pt-1 ">
      <div className="flex justify-between items-center mb-2 mt-2">
        <div className="flex items-center w-full mt-1">
          <IconButton onClick={handleBack}>
            <FuseSvgIcon className="text-7xl" size={22} color="action">
              heroicons-outline:arrow-long-left
            </FuseSvgIcon>
          </IconButton>
          <Typography className="font-semibold text-lg">
            Cron Job Details
          </Typography>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div variants={itemVariants} className="mb-4">
            <Box
              className="border-l-4 overflow-hidden"
              style={{
                borderLeftColor:
                  primaryColor === "info" ? "#2196f3" : "#f44336",
              }}
            >
              <Box className="flex justify-between items-center p-4">
                <Typography className="text-lg font-medium flex gap-x-2 items-center">
                  {jobDetail?.cron_type == "HouseholdData" && (
                    <FuseSvgIcon
                      className="text-7xl"
                      size={22}
                      color={jobDetail.status === "running" ? "info" : "action"}
                    >
                      {jobDetail.status === "running"
                        ? "heroicons-solid:building-office"
                        : "heroicons-outline:building-office"}
                    </FuseSvgIcon>
                  )}
                  {jobDetail?.cron_type == "AreaData" && (
                    <FuseSvgIcon
                      className="text-7xl"
                      size={22}
                      color={jobDetail.status === "running" ? "info" : "action"}
                    >
                      {jobDetail.status === "running"
                        ? "heroicons-solid:globe-asia-australia"
                        : "heroicons-outline:globe-asia-australia"}
                    </FuseSvgIcon>
                  )}
                  {jobDetail?.cron_type == "AnomalyData" && (
                    <FuseSvgIcon
                      className="text-7xl"
                      size={22}
                      color={jobDetail.status === "running" ? "info" : "action"}
                    >
                      {jobDetail.status === "running"
                        ? "heroicons-solid:bug-ant"
                        : "heroicons-outline:bug-ant"}
                    </FuseSvgIcon>
                  )}
                  {jobDetail?.cron_type} - {jobDetail?.city_id || "N/A"} -{" "}
                  {jobDetail?.district_id || "N/A"}
                </Typography>
                <Chip
                  icon={
                    jobDetail?.status === "stopped" ? (
                      <InfoIcon color={primaryColor} fontSize="small" />
                    ) : (
                      <ApiRoundedIcon color={primaryColor} fontSize="small" />
                    )
                  }
                  label={jobDetail?.status}
                  color={primaryColor}
                  size="small"
                />
              </Box>
            </Box>
          </motion.div>

          <Box>
            <form onSubmit={handleSubmit(handleJobSubmit)}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Controller
                  name="distribution_type"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Typography className="mb-2 mt-5 text-md font-medium flex items-center">
                        📊 Distribution Method
                      </Typography>
                      <Select
                        {...field}
                        disabled={jobDetail?.status === "running"}
                        fullWidth
                        className="rounded-sm"
                        error={!!errors.distribution_type}
                      >
                        {DISTRIBUTION_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Controller
                  name="cron_time"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Typography className="mb-2 mt-5 text-md font-medium flex items-center">
                        ⏳ Sending Time (ms)
                      </Typography>
                      <TextField
                        {...field}
                        disabled={jobDetail?.status === "running"}
                        type="number"
                        fullWidth
                        placeholder="Enter milliseconds"
                        className="rounded-sm"
                        error={!!errors.cron_time}
                      />
                      {msValid && (
                        <div className="flex flex-col gap-y-2 p-2 border border-dashed rounded-md mt-4">
                          <Typography className="mt-2 text-md">
                            🕒 <strong>Cron:</strong> <code>{cronExpr}</code>
                          </Typography>
                          <Typography className="mt-1 text-md">
                            🧭 <strong>Detail:</strong> {detailed}
                          </Typography>
                        </div>
                      )}
                    </>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-4"
              >
                <Controller
                  name="random_order"
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={jobDetail?.status === "running"}
                            value={Boolean(field.value)}
                            onChange={(e) => field.onChange(e.target.checked)}
                            size="small"
                          />
                        }
                        label="Random Order"
                      />
                    );
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex gap-x-2 items-center mt-4"
              >
                {jobDetail?.status === "stopped" && (
                  <Button
                    type="submit"
                    variant="outlined"
                    color="secondary"
                    className="rounded-md"
                    fullWidth
                    disabled={
                      !isValid ||
                      updateLoading ||
                      !msValid ||
                      !isDirty ||
                      jobDetail.status === "running"
                    }
                  >
                    {updateLoading ? <CircularProgress size={24} /> : "Update"}
                  </Button>
                )}
                <Button
                  variant="contained"
                  color={jobDetail?.status === "stopped" ? "info" : "info"}
                  startIcon={
                    jobDetail?.status === "stopped" ? (
                      <SensorsIcon className="mt-[1px]" />
                    ) : (
                      <SensorsOffTwoToneIcon className="mt-[1px]" />
                    )
                  }
                  className="rounded-sm hover:shadow-lg transition-all"
                  fullWidth
                  onClick={updateStatus}
                  disabled={updateLoading}
                >
                  {jobDetail?.status === "stopped" ? "Start" : "Stop"}
                </Button>
              </motion.div>
            </form>
          </Box>

          <Divider className="mt-10"></Divider>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <DistributedChart />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default JobQuickView;
