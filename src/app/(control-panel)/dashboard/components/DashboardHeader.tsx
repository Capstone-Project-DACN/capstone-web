import React, { use, useEffect } from "react";
import {
  Select,
  MenuItem,
  Button,
  Box,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  setDeviceId,
  setDistrictId,
  setTimeEnd,
  setTimeSlot,
  setTimeStart,
} from "../store/dashboardSlice";
import { useThemeMediaQuery } from "@fuse/hooks";

interface HeaderProps {
  onTimeframeChange?: (timeframe: string, dateRange?: DateRange) => void;
  onTabChange?: (tab: string) => void;
  onExport?: () => void;
  toggleReload?: () => void;
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

const DashboardHeader: React.FC<HeaderProps> = ({ onExport, toggleReload }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dashboardStore = useSelector((state: any) => state?.dashboard?.dashboardSlice);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const dispatch = useDispatch<AppDispatch>();

  const camelCaseKey = (key: string) => {
    return key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  };

  const defaultValues = {
    "time-start": new Date().toISOString(),
    "time-end": new Date().toISOString(),
    "time-slot": "1d",
    "device-id": "household-HCMC-Q1-0",
    "district-id": "area-HCMC-Q1",
  };

  const paramToActionMap = {
    "time-start": setTimeStart,
    "time-end": setTimeEnd,
    "time-slot": setTimeSlot,
    "device-id": setDeviceId,
    "district-id": setDistrictId,
  };

  useEffect(() => {
    let updated = false;
    const fullURL = localStorage.getItem("fullURL");
    const searchParams = fullURL?.includes("?") ? new URLSearchParams(fullURL?.split("?")[1]) : new URLSearchParams(window.location.search);

    Object.keys(defaultValues).forEach((key) => {
      const paramValue = searchParams.get(key) || "";
      const storeValue = dashboardStore?.[camelCaseKey(key)];
      if (paramValue && !storeValue) {
        searchParams.set(key, paramValue);
        updated = true;
        dispatch(paramToActionMap[key](paramValue));
      } else if (storeValue && !paramValue || (storeValue && paramValue)) {
        searchParams.set(key, storeValue);
        updated = true;
      } else if (!storeValue && !paramValue) {
        dispatch(paramToActionMap[key](defaultValues[key]));
      }
    });

    if (updated) {
      navigate(`/dashboard?${searchParams.toString()}`);
    }
  }, []);

  const handleTimeSlotChange = (event: SelectChangeEvent<string>) => {
    const updateParams = new URLSearchParams(window.location.search);
    updateParams.set("time-slot", event.target.value);
    navigate(`/dashboard?${updateParams}`);
    dispatch(setTimeSlot(event.target.value));
  };

  return (
    <Box
      className="w-full flex-col md:flex-row flex items-center justify-between py-1 mt-2"
      sx={{
        backgroundColor: theme.palette.background.paper,
        overflowX: "auto",
      }}
    >
      <div className="flex items-center w-full md:w-2/3 gap-2 font-semibold mb-2 md:mb-0 px-2 md:px-0">
        {!isMobile && <span>From:</span>}
        <DateTimePicker
          value={
            dashboardStore?.timeStart
              ? new Date(dashboardStore?.timeStart)
              : null
          }
          onChange={(e) => {
            const updateParams = new URLSearchParams(window.location.search);
            const formatted = e.toISOString().replace(".000", "");
            updateParams.set("time-start", formatted);
            dispatch(setTimeStart(formatted));
            navigate(`/dashboard?${updateParams}`);
          }}
          slotProps={{
            textField: { size: "medium", sx: { width: 220 } },
          }}
        />
        {!isMobile && <span>To:</span>}
        <DateTimePicker
          value={
            dashboardStore?.timeEnd ? new Date(dashboardStore?.timeEnd) : null
          }
          onChange={(e) => {
            const updateParams = new URLSearchParams(window.location.search);
            const formatted = e.toISOString().replace(".000", "");
            updateParams.set("time-end", formatted);
            dispatch(setTimeEnd(formatted));
            navigate(`/dashboard?${updateParams}`);
          }}
          slotProps={{
            textField: { size: "medium", sx: { width: 220 } },
          }}
        />
        {!isMobile && <span>Time slot:</span>}
        <Select
          defaultValue={"1m"}
          value={dashboardStore?.timeSlot || "1m"}
          name="timeSlot"
          onChange={handleTimeSlotChange}
          size="medium"
          className="rounded-sm"
        >
          <MenuItem value="1m">1 minute</MenuItem>
          <MenuItem value="1h">1 hour</MenuItem>
          <MenuItem value="1d">1 day</MenuItem>
        </Select>
      </div>
      <div className="flex items-center justify-start md:justify-end w-full md:w-1/3 gap-x-2 px-2 md:px-0">
        <Button
          variant="contained"
          onClick={toggleReload}
          className="rounded-sm"
          startIcon={
            <FuseSvgIcon className="text-7xl" size={18}>
              heroicons-outline:arrow-path
            </FuseSvgIcon>
          }
        >
          Reload
        </Button>
        {/* <Button
          variant="contained"
          onClick={() => navigate("/dashboard/predict")}
          color="success"
          className="rounded-sm"
          // startIcon={
          //   <FuseSvgIcon className="text-7xl" size={18}>
          //     heroicons-outline:arrow-trending-up
          //   </FuseSvgIcon>
          // }
        >
          District Usage
        </Button> */}
      </div>
    </Box>
  );
};

export default DashboardHeader;
