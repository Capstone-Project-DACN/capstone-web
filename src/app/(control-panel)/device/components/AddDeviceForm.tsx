import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert, 
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { addAreaDevice, addHouseholdDevice } from '../store/deviceSlice';

// Validation schemas
const areaSchema = yup.object({
  deviceId: yup
    .string()
    .required('Device ID is required')
    .matches(/^area-[A-Za-z0-9]+-[A-Za-z0-9]+$/, 'Area device ID must follow format: area-[location]-[subLocation] (e.g., area-HCMC-Q5)')
});

const householdSchema = yup.object({
  prefix: yup
    .string()
    .required('Prefix is required')
    .matches(/^household-[A-Za-z0-9]+-[A-Za-z0-9]+$/, 'Household prefix must follow format: household-[location]-[subLocation] (e.g., household-HCMC-Q5)'),
  start: yup
    .number()
    .required('Start range is required')
    .integer('Must be an integer')
    .min(0, 'Must be at least 0'),
  end: yup
    .number()
    .required('End range is required')
    .integer('Must be an integer')
    .min(1, 'Must be at least 1')
    .test('is-greater-than-start', 'End must be greater than start', function(value) {
      return value > this.parent.start;
    })
});

const AddDeviceForm = ({ setRightSidebarOpen }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const areaForm = useForm({
    resolver: yupResolver(areaSchema),
    defaultValues: {
      deviceId: 'area-HCMC-Q#'
    }
  });

  const householdForm = useForm({
    resolver: yupResolver(householdSchema),
    defaultValues: {
      prefix: 'household-HCMC-Q#',
      start: 0,
      end: 100
    }
  });

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  const handleAreaSubmit = async (data: any) => {
    setLoading(true);
    dispatch(addAreaDevice(data)).then((response: any) => {
      setLoading(false);
    });
  };

  const handleHouseholdSubmit = async (data: any) => {
    setLoading(true);
    dispatch(addHouseholdDevice(data)).then((response: any) => {
      setLoading(false);
    });
  };

  return (
    <div className="px-4 pt-1">
      <div className="flex justify-between items-center mb-2">
        <Typography className='font-semibold text-lg mt-2' gutterBottom>
          New Device
        </Typography>
        <IconButton
          onClick={() => {
            setRightSidebarOpen(false);
          }}
        >
          <FuseSvgIcon size={24} color="action">
            heroicons-outline:x-mark
          </FuseSvgIcon>
        </IconButton>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Area Device" />
          <Tab label="Household Devices" />
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
            Area: <code>area-[location]-[subLocation]</code> {" "}
            (e.g., area-HCMC-Q5)
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
      <Box sx={{ display: tabValue === 0 ? "block" : "none" }}>
        <form onSubmit={areaForm.handleSubmit(handleAreaSubmit)}>
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
                  error?.message || "Format: area-[location]-[subLocation]"
                }
                disabled={loading}
                placeholder="area-HCMC-Q5"
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className='rounded-md'
            fullWidth
            sx={{ mt: 2 }}
            disabled={!areaForm.formState.isValid || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Add Area Device"}
          </Button>
        </form>
      </Box>

      {/* Household Devices Form */}
      <Box sx={{ display: tabValue === 1 ? "block" : "none" }}>
        <form onSubmit={householdForm.handleSubmit(handleHouseholdSubmit)}>
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
                  error?.message || "Format: household-[location]-[subLocation]"
                }
                disabled={loading}
                placeholder="household-HCMC-Q5"
              />
            )}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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
          </Box>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              This will create devices with IDs from{" "}
              {householdForm.watch("prefix")}-{householdForm.watch("start")} to{" "}
              {householdForm.watch("prefix")}-{householdForm.watch("end")}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className='rounded-md'
            fullWidth
            disabled={!householdForm.formState.isValid || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Add Household Devices"}
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default AddDeviceForm;