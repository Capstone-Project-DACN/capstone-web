import React, { useEffect } from "react";
import {
  Select,
  MenuItem,
  Button,
  Box,
  useTheme,
  OutlinedInput,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useThemeMediaQuery } from "@fuse/hooks";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  getPredictDailyData,
  setAllDate,
  setDeviceId,
  setTimeEnd,
  setTimeStart,
} from "../store/predict/predictSlice";
import { end } from "@popperjs/core";

const districts = [{ label: "Quận 10", value: "area-HCMC-Q10" }];

function getStyles(name: string, selectedValue: string | null, theme: any) {
  return {
    fontWeight:
      selectedValue === name
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "150px",
      margin: "3px",
    },
  },
};

const PredictHeader = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const startTime = new URLSearchParams(location.search).get("start-date");
  const endTime = new URLSearchParams(location.search).get("end-date");
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch<AppDispatch>();
  const predictStore = useSelector(
    (state: any) => state?.predict?.predictSlice
  );

  const defaultValues = {
    "start-date": new Date().toISOString(),
    "end-date": new Date().toISOString(),
  };

  const paramToActionMap = {
    "start-date": setTimeStart,
    "end-date": setTimeEnd,
  };

  useEffect(() => {
    let updated = false;
    const fullURL = localStorage.getItem("fullURL_predict");
    const searchParams = fullURL?.includes("?")
      ? new URLSearchParams(fullURL?.split("?")[1])
      : new URLSearchParams(window.location.search);

    Object.keys(defaultValues).forEach((key) => {
      const paramValue = searchParams.get(key) || "";
      const storeValue =
        key === "start-date"
          ? predictStore?.timeStart
          : key === "end-date"
            ? predictStore?.timeEnd
            : new Date().toISOString();

      let end_time_value: string | null = null;

      if (paramValue && !storeValue) {
        searchParams.set(key, paramValue);
        updated = true;
        dispatch(paramToActionMap[key](paramValue));
        end_time_value = paramValue;
      } else if ((storeValue && !paramValue) || (storeValue && paramValue)) {
        searchParams.set(key, storeValue);
        updated = true;
        end_time_value = storeValue;
      } else if (!storeValue && !paramValue) {
        dispatch(paramToActionMap[key](defaultValues[key]));
        end_time_value = defaultValues[key];
      }

      // ✅ FIX: Properly compare ISO date strings by converting to Date
      if (
        key === "end-date" &&
        new Date(end_time_value as string) > new Date("2025-05-31")
      ) {
        const endDate = new Date("2025-05-31");
        dispatch(setTimeEnd(endDate.toISOString()));
        searchParams.set("end-date", endDate.toISOString());
        updated = true;
      }
    });

    if (updated) {
      navigate(`/dashboard/predict?${searchParams.toString()}`);
    }
  }, []);

  const handleChange = (event: any) => {
    dispatch(setDeviceId(event.target.value));
  };

  const handlePredict = () => {
    dispatch(getPredictDailyData({}));
  };

  useEffect(() => {
    const getDateRange = (startDate: Date, endDate: Date): string[] => {
      const dates = [];
      let currentDate = new Date(startDate);
      if (currentDate > endDate) {
        return dates;
      }
      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };
    const start_time = startTime ? new Date(startTime) : new Date();
    const end_time = endTime ? new Date(endTime) : new Date();
    if (isNaN(start_time.getTime()) || isNaN(end_time.getTime())) {
      console.error("Invalid startTime or endTime");
      return;
    }
    const allDates = getDateRange(start_time, end_time);
    dispatch(setAllDate(allDates));
  }, [startTime, endTime]);

  return (
    <Box
      className="w-full flex-col md:flex-row flex items-center justify-between py-1 mt-2"
      sx={{
        backgroundColor: theme.palette.background.paper,
        overflowX: "auto",
      }}
    >
      <div className="flex items-center justify-between md:justify-start w-full md:w-1/3 mb-2 md:mb-0 gap-x-2 px-2 md:px-0">
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          className="rounded-sm"
          startIcon={
            <FuseSvgIcon className="text-7xl" size={18}>
              heroicons-outline:arrow-left
            </FuseSvgIcon>
          }
        >
          Back
        </Button>
        {isMobile && (
          <Select
            displayEmpty
            sx={{ width: "150px" }}
            value={predictStore?.deviceId || "area-HCMC-Q10"}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (!selected) {
                return <em>Select District</em>;
              }
              const district = districts.find((d) => d.value === selected);
              return district ? district.label : "Select District";
            }}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
          >
            {districts.map((district: any) => (
              <MenuItem
                key={district.value}
                value={district.value}
                style={getStyles(district.value, predictStore?.deviceId, theme)}
              >
                {district.label}
              </MenuItem>
            ))}
          </Select>
        )}
      </div>
      <div className="flex items-center justify-end w-full md:w-2/3 gap-2 font-semibold px-2 md:px-0">
        {!isMobile && (
          <Select
            displayEmpty
            sx={{ width: "150px" }}
            value={predictStore?.deviceId || "area-HCMC-Q10"}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (!selected) {
                return <em>Select District</em>;
              }
              const district = districts.find((d) => d.value === selected);
              return district ? district.label : "Select District";
            }}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
          >
            {districts.map((district: any) => (
              <MenuItem
                key={district.value}
                value={district.value}
                style={getStyles(district.value, predictStore?.deviceId, theme)}
              >
                {district.label}
              </MenuItem>
            ))}
          </Select>
        )}
        {!isMobile && <span className="ml-4 text-gray-400"> From:</span>}
        <DateTimePicker
          value={
            predictStore?.timeStart
              ? new Date(predictStore?.timeStart)
              : new Date()
          }
          onChange={(e) => {
            if (e) {
              const updateParams = new URLSearchParams(location.search);
              const formatted = e.toISOString().replace(".000", "");
              updateParams.set("start-date", formatted);
              dispatch(setTimeStart(formatted));
              navigate(`/dashboard/predict?${updateParams}`);
            }
          }}
          slotProps={{
            textField: { size: "medium", sx: { width: 220 } },
          }}
        />
        {!isMobile && <span className="text-gray-400">To:</span>}
        <DateTimePicker
          value={
            predictStore?.timeEnd ? new Date(predictStore?.timeEnd) : new Date()
          }
          onChange={(e) => {
            if (e) {
              const updateParams = new URLSearchParams(location.search);
              const formatted = e.toISOString().replace(".000", "");
              updateParams.set("end-date", formatted);
              dispatch(setTimeEnd(formatted));
              navigate(`/dashboard/predict?${updateParams}`);
            }
          }}
          slotProps={{
            textField: { size: "medium", sx: { width: 220 } },
          }}
        />
        <Button
          variant="contained"
          onClick={handlePredict}
          className="rounded-sm"
          color="primary"
          disabled={new Date(endTime as string) <= new Date("2025-05-31")}
          startIcon={
            <FuseSvgIcon className="text-7xl" size={18}>
              heroicons-outline:arrow-trending-up
            </FuseSvgIcon>
          }
        >
          Predict
        </Button>
      </div>
    </Box>
  );
};

export default PredictHeader;
