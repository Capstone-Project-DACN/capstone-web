import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateJobStatus } from "../store/jobSlice";
import { useState } from "react";
import { useNavigate } from "react-router";

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const JobItem = ({ job, index, setRightSidebarOpen }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = new URLSearchParams(window.location.search);
  const jobQuickViewId = searchParams.get("job_id");

  const handleOnClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("job_id", job.id);
    searchParams.set("cron_type", job.cron_type);
    searchParams.set("district_id", job.district_id);
    searchParams.set("city_id", job.city_id);
    navigate(`/cronjob?${searchParams.toString()}`);
    setRightSidebarOpen(true);
  };

  const updateStatus = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
    dispatch(
      updateJobStatus({
        job: job,
        enable: job.status === "running" ? false : true
      })
    ).then(() => setLoading(false));
  };

  return (
    <motion.div
      key={index}
      variants={itemVariants}
      whileHover={{
        backgroundColor: "rgba(0,0,0,0.03)",
        scale: 1.0005,
        transition: { duration: 0.15 },
      }}
    >
      <Box
        sx={{
          backgroundColor:
            jobQuickViewId == job.id && theme.palette.action.selected,
        }}
        onClick={handleOnClick}
        className="flex items-center font-normal justify-between h-15 px-4 border-b border-r border-l cursor-pointer"
      >
        <div className="w-3/10 pl-2 line-clamp-1 trucate flex gap-x-2">
          {job?.cron_type == "HouseholdData" && (
            <FuseSvgIcon
              className="text-7xl"
              size={18}
              color={job.status === "running" ? "info" : "action"}
            >
              {job.status === "running"
                ? "heroicons-solid:building-office"
                : "heroicons-outline:building-office"}
            </FuseSvgIcon>
          )}
          {job?.cron_type == "AreaData" && (
            <FuseSvgIcon
              className="text-7xl"
              size={18}
              color={job.status === "running" ? "info" : "action"}
            >
              {job.status === "running"
                ? "heroicons-solid:globe-asia-australia"
                : "heroicons-outline:globe-asia-australia"}
            </FuseSvgIcon>
          )}
          {job?.cron_type == "AnomalyData" && (
            <FuseSvgIcon
              className="text-7xl"
              size={18}
              color={job.status === "running" ? "info" : "action"}
            >
              {job.status === "running"
                ? "heroicons-solid:bug-ant"
                : "heroicons-outline:bug-ant"}
            </FuseSvgIcon>
          )}
          {job?.cron_type}
        </div>
        <div className="w-2/10">
          <Typography variant="body2">{job.city_id}</Typography>
        </div>
        <div className="w-2/10">
          <Typography variant="body2">{job.district_id}</Typography>
        </div>
        <div className="w-2/10">
          <Typography
            variant="body2"
            className={
              job.status === "stopped"
                ? "text-red-600 capitalize"
                : "text-blue-500 capitalize"
            }
          >
            {job.status}
          </Typography>
        </div>
        <div className="w-1/10 flex items-center justify-between">
          <IconButton onClick={updateStatus} disabled={loading}>
            {job.status === "stopped" ? (
              <FuseSvgIcon className="text-7xl" size={18} color="disabled">
                heroicons-solid:play
              </FuseSvgIcon>
            ) : (
              <FuseSvgIcon className="text-7xl" size={18} color="secondary">
                heroicons-solid:stop
              </FuseSvgIcon>
            )}
          </IconButton>
        </div>
      </Box>
    </motion.div>
  );
};

export default JobItem;
