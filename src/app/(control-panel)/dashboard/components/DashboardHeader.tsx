import React, { useEffect } from "react";
import {
  Tabs,
  Tab,
  Select,
  MenuItem,
  Button,
  Box,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import useEnhancedEffect from "@mui/utils/useEnhancedEffect";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const areas = [
  { id: 0, name: "All" },
  { id: 1, name: "area_HCMC_Q1" },
  { id: 2, name: "area_HCMC_Q3" },
  { id: 3, name: "area_HCMC_Q4" },
  { id: 4, name: "area_HCMC_Q5" },
  { id: 5, name: "area_HCMC_Q6" },
  { id: 6, name: "area_HCMC_Q7" },
  { id: 7, name: "area_HCMC_Q8" },
  { id: 8, name: "area_HCMC_Q9" },
  { id: 9, name: "area_HCMC_Q10" },
  { id: 10, name: "area_HCMC_Q11" },
];

interface HeaderProps {
  onTimeframeChange?: (timeframe: string, dateRange?: DateRange) => void;
  onTabChange?: (tab: string) => void;
  onExport?: () => void;
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

const DashboardHeader: React.FC<HeaderProps> = ({ onExport }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const timeframe = searchParams.get("timeframe");
  const source = searchParams.get("source");

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    if (!timeframe && !source) navigate(`/dashboard?timeframe=daily&source=All`);
    else if (!timeframe && source) {
      currentParams.set("timeframe", "daily")
      navigate(`/dashboard?${currentParams}`);
    }
    else if (timeframe && !source) {
      currentParams.set("source", "All")
      navigate(`/dashboard?${currentParams}`);
    }
  }, [])
  
  const handleTimeframeChange = (event: SelectChangeEvent<string>) => {
    console.log(event.target);
    const updateParams = new URLSearchParams(window.location.search);
    updateParams.set(event.target.name, event.target.value);
    navigate(`/dashboard?${updateParams}`)
  };

  return (
    <Box
      className="w-full flex items-center justify-between py-1 mt-2"
      sx={{
        backgroundColor: theme.palette.background.paper,
        overflowX: "auto",
      }}
    > 
        <Button
          variant="contained"
          onClick={onExport}
          color="primary"
          className="rounded-sm"
          endIcon={<FuseSvgIcon className="text-7xl" size={18}>heroicons-outline:arrow-trending-up</FuseSvgIcon>}
        >
          Predict
        </Button>
      <div className="flex items-center justify-end gap-2">
        <Select
          defaultValue={"All"}
          value={source}
          name="source"
          onChange={handleTimeframeChange}
          size="medium"
          className="rounded-sm"  
        >
          {areas.map((area) => (
            <MenuItem value={area.name}>{area.name}</MenuItem>
          ))}
        </Select>
        <Select
          defaultValue={"daily"}
          value={timeframe}
          name="timeframe" 
          onChange={handleTimeframeChange}
          size="medium"
          className="rounded-sm"
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>

        <Button
          variant="contained"
          onClick={onExport}
          color="secondary"
          className="rounded-sm"
        >
          Export
        </Button>
      </div>
    </Box>
  );
};

export default DashboardHeader;
