import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { getSettings, updateSetings } from "../store/anomalySlice";
import { useSelector } from "react-redux";
import { convertMillisecondsToTimeUnit } from "@/utils/helper";
import { divide } from "lodash";

// Validation schema
const settingsSchema = yup.object({
  window_time: yup
    .number()
    .required("Window time is required")
    .min(0, "Window time must be at least 0"),
  device_threshold: yup
    .number()
    .required("Device threshold is required")
    .min(0, "Device threshold must be at least 0"),
  area_threshold: yup
    .number()
    .required("Area threshold is required")
    .min(0, "Area threshold must be at least 0"),
  min_delta_consumption: yup
    .number()
    .required("Min delta consumption is required")
    .min(0, "Min delta consumption must be at least 0"),
});

const AnomalySettingsTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const settingData = useSelector(
    (state: any) => state?.anomaly?.anomalySlice?.settings
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(settingsSchema),
    defaultValues: settingData,
  });

  useEffect(() => {
    setLoading(true);
    dispatch(getSettings({})).then(() => {
      setLoading(false);
    });
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    dispatch(updateSetings({ data: data }))
      .then(() => {
        dispatch(
          showMessage({
            message: "Settings updated successfully",
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
      })
      .catch(() => {
        dispatch(
          showMessage({
            message: "Error updating settings",
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box className="p-4 pt-0 mx-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-x-4 w-full">
            <Controller
              name="window_time"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col w-1/2">
                  <div className="flex items-center gap-x-2">
                    <Typography className=" text-md font-medium flex items-center">
                      ⏳ Window Time (ms)
                    </Typography>
                    <Typography className="text-md">
                      🧭 <strong>Detail:</strong>{" "}
                      {convertMillisecondsToTimeUnit(field.value)}
                    </Typography>
                  </div>

                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    margin="normal"
                    disabled={loading}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              )}
            />

            <Controller
              name="device_threshold"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col w-1/2">
                  <Typography className=" text-md font-medium flex items-center">
                    📊 Device Threshold (%)
                  </Typography>
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    margin="normal"
                    disabled={loading}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              )}
            />
          </div>
          <div className="flex items-center gap-x-4 mt-4">
            <Controller
              name="min_delta_consumption"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col w-1/2">
                  <Typography className=" text-md font-medium flex items-center">
                    📊 Min Delta Consumption (kwh)
                  </Typography>
                  <TextField
                    {...field}
                    label="Min Delta Consumption"
                    type="number"
                    fullWidth
                    margin="normal"
                    disabled={loading}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              )}
            />

            <Controller
              name="area_threshold"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col w-1/2">
                  <Typography className=" text-md font-medium flex items-center">
                    📊 Area Threshold (%)
                  </Typography>
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    margin="normal"
                    disabled={loading}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              )}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="flex justify-end"
          >
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              className="rounded-sm"
              disabled={loading}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "Update Settings"}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </Box>
  );
};

export default AnomalySettingsTab;
