import { TextField, Typography } from "@mui/material";
import ColumnChart from "./components/ColumnChart";
import StatsWidget from "./components/StatsWidget";
import DistrictChart from "./components/DistrictChart";
import DeviceChart from "./components/DeviceChart";
import DistrictDropdown from "./components/DistrictDropdown";
import { getCityData, getUsageDataByDeviceId, getUsageDataByDistrictId, setDeviceId } from "../store/dashboardSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const DataMetricMainContent = (props: any) => {
  const { reloadStatus } = props
  const dispatch = useDispatch<AppDispatch>();
  const deviceId = new URLSearchParams(window.location.search).get("device-id");
  const districtId = new URLSearchParams(window.location.search).get("district-id");
  const timeStart = new URLSearchParams(window.location.search).get("time-start");
  const timeEnd = new URLSearchParams(window.location.search).get("time-end");
  const time = new URLSearchParams(window.location.search).get("time-slot");
  const navigate = useNavigate();
  const [cityLoading, setCityLoading] = useState(false);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [deviceLoading, setDeviceLoading] = useState(false);

  useEffect(() => {
    if(deviceId) dispatch(setDeviceId(deviceId));
  }, [])

  useEffect(() => {
    setCityLoading(true);
    dispatch(getCityData({})).then(() => setCityLoading(false));
  }, [timeStart, timeEnd, time, reloadStatus])

  useEffect(() => {
    setDistrictLoading(true);
    dispatch(getUsageDataByDistrictId({})).then(() => setDistrictLoading(false));
  }, [districtId, timeStart, timeEnd, time, reloadStatus])

  useEffect(() => {
    setDeviceLoading(true);
    dispatch(getUsageDataByDeviceId({})).then(() => setDeviceLoading(false));
  }, [deviceId, timeStart, timeEnd, time , reloadStatus])


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

      <div className="mt-10 flex flex-col gap-y-10">
        <Typography className="text-xl font-semibold">City</Typography>
        <ColumnChart loading={cityLoading} />
      </div>

      <div className="flex item-center justify-between gap-x-5">
        <div className="mt-10 w-1/2 flex flex-col gap-y-10">
          <div className="flex items-center justify-between">
            <Typography className="text-xl font-semibold w-full">
              Districts
            </Typography>
            <DistrictDropdown />
          </div>
          <DistrictChart loading={districtLoading} />
        </div>

        <div className="mt-10 w-1/2 flex flex-col gap-y-10">
          <div className="flex items-center justify-between">
            <Typography className="text-xl font-semibold w-full">
              Devices
            </Typography>
            <TextField
              size="small"
              placeholder="Device id"
              className="w-[300px]"
              value={deviceId}
              onChange={(e: any) => {
                dispatch(setDeviceId(e.target.value));
                const updatePrams = new URLSearchParams(window.location.search);
                updatePrams.set("device-id", e.target.value);
                navigate(`/dashboard?${updatePrams.toString()}`);
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #aaa",
                  height: "40px",  
                },
              }}
            />
          </div>
          <DeviceChart loading={deviceLoading} />
        </div>
      </div>
    </div>
  );
};

export default DataMetricMainContent;
