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
  styled,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AppDispatch } from "@/store/store";
import SensorsOffTwoToneIcon from "@mui/icons-material/SensorsOffTwoTone";
import SensorsIcon from "@mui/icons-material/Sensors";
import {
  getJobDetail,
  updateJobDetail,
  updateJobStatus,
} from "../store/jobSlice";
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
import { openJobDialog } from "@/dialogs/job/JobDialogSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { random } from "lodash";
import { end } from "@popperjs/core";

const StickyHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 10,
}));

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

  distribution_type: yup
    .string()
    .required("Distribution type is required"),

  start_id: yup
    .number()
    .required("Start ID is required"),

  end_id: yup
    .number()
    .required("End ID is required")
});


interface JobQuickViewProps {
  setRightSidebarOpen: (isOpen: boolean) => void;
}

const JobQuickView: React.FC<JobQuickViewProps> = ({ setRightSidebarOpen }) => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const jobQuickViewId = searchParams.get("job_id");
  const dispatch = useDispatch<AppDispatch>();
  const jobDetail = useSelector((state: any) => state?.jobs?.jobSlice?.detail);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const primaryColor = jobDetail?.status === "running" ? "primary" : "warning";
  const [refresh, toggleRefresh] = React.useState(false);

  const {
    control,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    watch,
    reset,
    setValue
  } = useForm({
    defaultValues: {
      distribution_type: "",
      cron_time: "",
      random_order: false,
      start_id: 0,
      end_id: 10,
      ...jobDetail,
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });


  console.log("jobDetail form", watch());

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
      const searchParams = new URLSearchParams(window.location.search);
      const job = {
        id: jobQuickViewId,
        district_id: searchParams.get("district_id"),
        city_id: searchParams.get("city_id"),
        cron_type: searchParams.get("cron_type"),
      };
      dispatch(getJobDetail({ job }))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [jobQuickViewId, dispatch]);

  useEffect(() => {
    if (jobDetail) {
      reset({
        ...jobDetail,
        random_order: jobDetail.random_order === "true",
        cron_time: cronToMilliseconds(jobDetail.cron_time),
      });
    }
  }, [jobDetail, reset]);

  console.log(jobDetail, watch());

  // Toggle job status
  const updateStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setUpdateLoading(true);
    dispatch(
      updateJobStatus({
        job: jobDetail,
        enable: jobDetail.status === "running" ? false : true,
      })
    )
      .catch(() => setUpdateLoading(false))
      .finally(() => setUpdateLoading(false));
  };

  // Submit form updates
  const handleJobSubmit = async (data: any) => {
    console.log(data);  
    setUpdateLoading(true);
    const payload = {
      ...data,
      start_id: parseInt(data.start_id),
      end_id: parseInt(data.end_id),
      cron_time: convertMillisecondsToTimeUnit(data.cron_time),
    };
    dispatch(updateJobDetail({ data: payload }))
      .then(() => {
        dispatch(
          showMessage({
            message: "Job updated successfully",
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
      })
      .catch(() => {
        setUpdateLoading(false);
        dispatch(
          showMessage({
            message: "Error updating job",
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
      })
      .finally(() => setUpdateLoading(false));
  };

  const handleBack = () => {
    const updateParams = new URLSearchParams(window.location.search);
    updateParams.delete("job_id");
    navigate(`/cronjob?${updateParams.toString()}`);
    setRightSidebarOpen(false);
  };

  if (!jobDetail) {
    return (
      <Box className="p-4 text-center flex gap-x-2 items-center justify-center mt-10">
        <Typography className="text-lg font-semibold mt-1">
          Job not found
        </Typography>
        <Button color="primary" onClick={handleBack} fullWidth={false}>
          Back to Jobs
        </Button>
      </Box>
    );
  }

  if (loading) {
    return <FuseLoading />;
  }

  const { cron_time, distribution_type, random_order } = watch();
  const myIsDirty = (
    millisecondsToCron(cron_time) !== jobDetail.cron_time ||
    String(distribution_type) !== String(jobDetail.distribution_type) ||
    String(random_order) !== String(jobDetail.random_order) ||
    String(jobDetail?.start_id) !== String(watch("start_id")) ||
    String(jobDetail?.end_id) !== String(watch("end_id"))
  );

  return (
    <div className="px-2">
      <StickyHeader className="flex items-center h-14 justify-between">
        <Button
          color="primary"
          className="font-semibold"
          startIcon={
            <FuseSvgIcon className="text-7xl" size={18} color="primary">
              heroicons-outline:arrow-left
            </FuseSvgIcon>
          }
          onClick={handleBack}
        >
          Cron job detail
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex gap-y-2 flex-col items-center pr-3"
        >
          <Button
            variant="contained"
            size="small"
            color={jobDetail?.status === "stopped" ? "secondary" : "warning"}
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
            {jobDetail?.status === "stopped" ? "Start job" : "Stop job"}
          </Button>
        </motion.div>
      </StickyHeader>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="px-3 pt-2"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <Box
              className="border-l-4 overflow-hidden"
              style={{
                borderLeftColor:
                  primaryColor === "primary" ? "#2196f3" : "#ED6C02",
              }}
            >
              <Box className="flex justify-between items-center p-4 pl-2">
                <Typography className="text-lg font-medium flex gap-x-2 items-center">
                  {jobDetail?.cron_type == "HouseholdData" && (
                    <FuseSvgIcon
                      className="text-7xl"
                      size={22}
                      color={
                        jobDetail.status === "running" ? "primary" : "error"
                      }
                    >
                      heroicons-solid:building-office
                    </FuseSvgIcon>
                  )}
                  {jobDetail?.cron_type == "AreaData" && (
                    <FuseSvgIcon
                      className="text-7xl"
                      size={22}
                      color={
                        jobDetail.status === "running" ? "primary" : "error"
                      }
                    >
                      heroicons-solid:globe-asia-australia
                    </FuseSvgIcon>
                  )}
                  {jobDetail?.cron_type == "AnomalyData" && (
                    <FuseSvgIcon
                      className="text-7xl"
                      size={22}
                      color={
                        jobDetail.status === "running" ? "primary" : "error"
                      }
                    >
                      heroicons-solid:bug-ant
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
                      {msValid && (
                        <div className="flex items-center py-2 rounded-md mb-2">
                          <Typography className="w-1/2 text-md">
                            🕒 <strong>Cron:</strong> <code>{cronExpr}</code>
                          </Typography>
                          <Typography className="w-1/2 text-md">
                            🧭 <strong>Detail:</strong> {detailed}
                          </Typography>
                        </div>
                      )}
                      <TextField
                        {...field}
                        disabled={jobDetail?.status === "running"}
                        type="number"
                        fullWidth
                        placeholder="Enter milliseconds"
                        className="rounded-sm"
                        error={!!errors.cron_time}
                      />
                    </>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-4 flex items-center justify-between"
              >
                <div className="flex flex-col">
                <Typography className="mb-2text-md font-medium flex items-center">
                  📊 Range device ids
                </Typography>
                <div className="flex items-center mt-2 justify-between gap-x-2">
                  <Controller
                    name="start_id"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          disabled={jobDetail?.status === "running"}
                          type="number"
                          onChange={(e) => {
                            const value = e.target.value;
                            if(Number(value) > 1000) return;
                            setValue("start_id", value);
                          }}
                          fullWidth
                          placeholder="Enter start"
                          className="rounded-sm"
                          error={!!errors.start_id}
                        />
                      );
                    }}
                  />
                  <Controller
                    name="end_id"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextField
                          {...field}
                          disabled={jobDetail?.status === "running"}
                          type="number"
                          fullWidth
                          onChange={(e) => {
                            const value  = e.target.value;
                            if(Number(value) > 1000) return;
                            setValue("end_id", value);
                          }}
                          placeholder="Enter end"
                          className="rounded-sm"
                          error={!!errors.end_id}
                        />
                      );
                    }}
                  />
                </div>
                </div>

              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-4 flex items-center justify-between"
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
                            checked={Boolean(field.value)}
                            onChange={(e) => field.onChange(e.target.checked)}
                            size="small"
                          />
                        }
                        label="Random Order"
                      />
                    );
                  }}
                />

                {jobDetail?.status === "stopped" && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    className="rounded-sm"
                    size="small"
                    disabled={
                      !isValid ||
                      updateLoading ||
                      !msValid ||
                      !myIsDirty ||
                      jobDetail.status === "running"
                    }
                  >
                    {updateLoading ? <CircularProgress size={18} /> : "Update"}
                  </Button>
                )}
              </motion.div>

              <Divider className="mt-5 mb-5"></Divider>
            </form>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mt-4">
              <Typography variant="body2" className="font-semibold mb-2">
                Distribution Visualization ({jobDetail?.distribution_type})
              </Typography>
              <div className="flex items-center gap-x-2">
                <IconButton
                  onClick={() => toggleRefresh((prev) => !prev)}
                  disabled={jobDetail?.status !== "running"}
                >
                  <FuseSvgIcon className="text-7xl" size={20} color="primary">
                    heroicons-outline:arrow-path
                  </FuseSvgIcon>
                </IconButton>
                <IconButton
                  onClick={() => {
                    dispatch(openJobDialog(null));
                  }}
                >
                  <FuseSvgIcon className="text-7xl" size={20} color="primary">
                    heroicons-outline:arrows-pointing-out
                  </FuseSvgIcon>
                </IconButton>
              </div>
            </div>
            <DistributedChart refresh={refresh} toggleRefresh={toggleRefresh} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default JobQuickView;
