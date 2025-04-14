import { TextField, Typography } from "@mui/material";
import ColumnChart from "./components/ColumnChart";
import StatsWidget from "./components/StatsWidget";
import DistrictChart from "./components/DistrictChart";
import DeviceChart from "./components/DeviceChart";
import DistrictDropdown from "./components/DistrictDropdown";

const DataMetricMainContent = () => {
  return (
    <div className="pb-10">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-10">
        <StatsWidget
          title="Devices"
          value={12500}
          trend={{
            value: 23,
            direction: "up",
          }}
          type="primary"
          perDay={true}
        />

        <StatsWidget
          title="Anomaly"
          value={95}
          trend={{
            value: 23,
            direction: "up",
          }}
          type="warning"
        />

        <StatsWidget
          title="Inactive"
          value={10}
          trend={{
            value: 23,
            direction: "up",
          }}
          type="warning"
        />

        <StatsWidget
          title="Average"
          value={25}
          trend={{
            value: 10,
            direction: "up",
          }}
          type="primary"
        />

        <StatsWidget
          title="Min - Max"
          value={95.4}
          secondValue={192225.4}
          trend={{
            value: 23,
            direction: "down",
          }}
          type="success"
        />
      </div>

      <div className="mt-10 shadow-sm flex flex-col gap-y-10">
        <Typography className="text-xl font-semibold">City</Typography>
        <ColumnChart />
      </div>

      <div className="flex item-center justify-between gap-x-5">
        <div className="mt-10 w-1/2 shadow-sm flex flex-col gap-y-10">
          <div className="flex items-center justify-between">
            <Typography className="text-xl font-semibold w-full">
              Districts
            </Typography>
            <DistrictDropdown />
          </div>
          <DistrictChart />
        </div>

        <div className="mt-10 w-1/2 shadow-sm flex flex-col gap-y-10">
          <div className="flex items-center justify-between">
            <Typography className="text-xl font-semibold w-full">
              Devices
            </Typography>
            <TextField
              size="small"
              placeholder="Device id"
              className="w-42"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #aaa",
                  height: "40px",  
                },
              }}
            />
          </div>
          <DeviceChart />
        </div>
      </div>
    </div>
  );
};

export default DataMetricMainContent;
