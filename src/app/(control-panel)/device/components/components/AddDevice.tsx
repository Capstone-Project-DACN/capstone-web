import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InfoIcon from "@mui/icons-material/Info";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { addAreaDevice, addHouseholdDevice, setTab } from "../../store/deviceSlice";
import { useNavigate, useParams } from "react-router";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { ac } from "node_modules/react-router/dist/development/route-data-DuV3tXo2.mjs";

// Validation schemas
const areaSchema = yup.object({
  deviceId: yup
    .string()
    .required("Device ID is required")
    .matches(
      /^area-[A-Za-z0-9]+-[A-Za-z0-9]+$/,
      "Area device ID must follow format: area-[location]-[subLocation] (e.g., area-HCMC-Q5)"
    ),
});

const householdSchema = yup.object({
  prefix: yup
    .string()
    .required("Prefix is required")
    .matches(
      /^household-[A-Za-z0-9]+-[A-Za-z0-9]+$/,
      "Household prefix must follow format: household-[location]-[subLocation] (e.g., household-HCMC-Q5)"
    ),
  start: yup
    .number()
    .required("Start range is required")
    .integer("Must be an integer")
    .min(0, "Must be at least 0"),
  end: yup
    .number()
    .required("End range is required")
    .integer("Must be an integer")
    .min(1, "Must be at least 1")
    .test(
      "is-greater-than-start",
      "End must be greater than start",
      function (value) {
        return value > this.parent.start;
      }
    ),
});

const AddDevice = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const areaForm = useForm({
    resolver: yupResolver(areaSchema),
    defaultValues: {
      deviceId: "area-HCMC-Q#",
    },
  });

  const householdForm = useForm({
    resolver: yupResolver(householdSchema),
    defaultValues: {
      prefix: "household-HCMC-Q#",
      start: 0,
      end: 100,
    },
  });

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  const handleAreaSubmit = async (data: any) => {
    setLoading(true);
    dispatch(addAreaDevice(data)).then((response: any) => {
      const topic = data?.deviceId.replace(/-/g, "_");
      navigate(`/device/overview?topic=${topic}`);
      dispatch(setTab("overview"));
      setLoading(false);
      areaForm.reset({
        deviceId: "area-HCMC-Q#",
      });
      dispatch(
        showMessage({
          message: "Add area device successfully",
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          }
        })
      );
    }).catch(() => {
      dispatch(
        showMessage({
          message: "Error adding area device",
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
    })
  };

  const handleHouseholdSubmit = async (data: any) => {
    setLoading(true);
    dispatch(addHouseholdDevice(data)).then((response: any) => {
      setLoading(false);
      const topic = data?.prefix.replace(/-/g, "_");
      navigate(`/device/overview?topic=${topic}`);
      dispatch(setTab("overview"));
      dispatch(
        showMessage({
          message: "Add household device successfully",
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          }
        })
      );  
      householdForm.reset({
        prefix: "household-HCMC-Q#",
        start: 0,
        end: 100,
      });
    }).catch(() => {
      dispatch(
        showMessage({
          message: "Error adding household device",
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
    })
  };

  return (
    <div className="px-4 pt-1">
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} color="secondary">
          <Tab label="Household Devices" />
          <Tab label="Area Device" />
        </Tabs>
      </Box>

      {/* Device ID Naming Rules */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 1,
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <InfoIcon fontSize="small" sx={{ mr: 1 }} />
          Device ID Format Rules:
        </Typography>
        <Box component="ul" sx={{ mt: 1, mb: 0 }}>
          <Typography component="li" variant="body2">
            Area: <code>area-[location]-[subLocation]</code> (e.g.,
            area-HCMC-Q5)
          </Typography>
          <Typography component="li" variant="body2">
            Household: <code>household-[location]-[subLocation]-[id]</code>
          </Typography>
          <Typography component="li" variant="body2">
            Anomaly: <code>household-[location]-[subLocation]-[id]</code>
          </Typography>
        </Box>
      </Box>

      {/* Area Device Form */}
      <AnimatePresence mode="wait">
        {tabValue === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Box>
              <form onSubmit={areaForm.handleSubmit(handleAreaSubmit)}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Controller
                    name="deviceId"
                    control={areaForm.control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Device ID"
                        fullWidth
                        margin="normal"
                        error={!!error}
                        helperText={
                          error?.message ||
                          "Format: area-[location]-[subLocation]"
                        }
                        disabled={loading}
                        placeholder="area-HCMC-Q5"
                      />
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    className="rounded-md"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={!areaForm.formState.isValid || loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Add Area Device"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Household Devices Form */}
      <AnimatePresence mode="wait">
        {tabValue === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Box>
              <form
                onSubmit={householdForm.handleSubmit(handleHouseholdSubmit)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Controller
                    name="prefix"
                    control={householdForm.control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Device Prefix"
                        fullWidth
                        margin="normal"
                        error={!!error}
                        helperText={
                          error?.message ||
                          "Format: household-[location]-[subLocation]"
                        }
                        disabled={loading}
                        placeholder="household-HCMC-Q5"
                      />
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="w-1/2"
                    >
                      <Controller
                        name="start"
                        control={householdForm.control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Start ID"
                            type="number"
                            fullWidth
                            error={!!error}
                            helperText={error?.message}
                            disabled={loading}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        )}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      className="w-1/2"
                    >
                      <Controller
                        name="end"
                        control={householdForm.control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="End ID"
                            type="number"
                            fullWidth
                            error={!!error}
                            helperText={error?.message}
                            disabled={loading}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        )}
                      />
                    </motion.div>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      This will create devices with IDs from{" "}
                      {householdForm.watch("prefix")}-
                      {householdForm.watch("start")} to{" "}
                      {householdForm.watch("prefix")}-
                      {householdForm.watch("end")}
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    className="rounded-md"
                    fullWidth
                    disabled={!householdForm.formState.isValid || loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Add Household Devices"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddDevice;
