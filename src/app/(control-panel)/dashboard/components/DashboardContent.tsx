import { Button, TextField, Typography } from "@mui/material";
import ColumnChart from "./components/ColumnChart";
import StatsWidget from "./components/StatsWidget";
import DistrictChart from "./components/DistrictChart";
import DeviceChart from "./components/DeviceChart";
import DistrictDropdown from "./components/DistrictDropdown";
import {
  getCityData,
  getDeviceTopics,
  getUsageDataByDeviceId,
  getUsageDataByDistrictId,
  searchAnomaly,
  searchInactiveDevice,
  setDeviceId,
} from "../store/dashboardSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const DataMetricMainContent = (props: any) => {
  const { reloadStatus } = props;
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = new URLSearchParams(window.location.search);
  const deviceIdValue = useSelector(
    (state: any) => state?.dashboard?.dashboardSlice?.deviceId
  );
  const dashboardStore = useSelector((state: any) => state?.dashboard?.dashboardSlice);
  const districtId = searchParams.get("district-id");
  const timeStart = searchParams.get("time-start");
  const timeEnd = searchParams.get("time-end");
  const deviceId = searchParams.get("device-id");
  const time = searchParams.get("time-slot");
  const navigate = useNavigate();
  const [cityLoading, setCityLoading] = useState(false);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [deviceLoading, setDeviceLoading] = useState(false);

useEffect(() => {
  if (deviceId) dispatch(setDeviceId(deviceId));

  Promise.all([
    dispatch(searchInactiveDevice({ pageNumber: 0, pageSize: 20, dateTime: false })),
    dispatch(searchAnomaly({type: ""})),
    dispatch(getDeviceTopics({}))
  ]);
}, []);


  useEffect(() => {
    setCityLoading(true);
    dispatch(getCityData({})).then(() => setCityLoading(false));
  }, [timeStart, timeEnd, time, reloadStatus]);

  useEffect(() => {
    setDistrictLoading(true);
    dispatch(getUsageDataByDistrictId({})).then(() =>
      setDistrictLoading(false)
    );
  }, [districtId, timeStart, timeEnd, time, reloadStatus]);

  useEffect(() => {
    setDeviceLoading(true);
    dispatch(getUsageDataByDeviceId({})).then(() => setDeviceLoading(false));
  }, [deviceId, timeStart, timeEnd, time, reloadStatus]);

  return (
    <div className="pb-10">
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-2 md:mt-10">
        <StatsWidget
          title="Devices"
          value={dashboardStore?.noOfDevices}
          trend={{
            value: 23,
            direction: "up",
          }}
          type="primary"
          perDay={true}
        />

        <StatsWidget
          title="Inactive"
          value={dashboardStore?.noOfInactiveDevices}
          trend={{
            value: 23,
            direction: "up",
          }}
          type="warning"
        />

        <StatsWidget
          title="Anomaly"
          value={dashboardStore?.noOfActiveAnomaly}
          trend={{
            value: 23,
            direction: "up",
          }}
          type="warning"
        />

        <StatsWidget
          title="Total Usage by City"
          value={Number(dashboardStore?.totalCityUsage)}
          trend={{
            value: 10,
            direction: "up",
          }}
          type="primary"
        />

        <StatsWidget
          title="Min - Max"
          value={Number(dashboardStore?.minUsage)}
          secondValue={Number(dashboardStore?.maxUsage)}
          trend={{
            value: 50,
            direction: "up",
          }}
          type="success"
        />
      </div>

      <div className="mt-10 flex flex-col gap-y-10 p-2 md:p-0">
        <Typography className="text-xl font-semibold">City</Typography>
        <ColumnChart loading={cityLoading} />
      </div>

      <div className="flex flex-col md:flex-row item-center justify-between gap-5">
        <div className="mt-10 p-2 md:p-0 w-full md:w-1/2 flex flex-col gap-y-10">
          <div className="flex items-center justify-between">
            <Typography className="text-xl font-semibold ">
              Districts
            </Typography>

            <div className="flex items-center gap-x-2">
              <DistrictDropdown />
              <Button
                onClick={() => navigate("/dashboard/predict")}
                color="primary"
                variant="outlined"
                className="rounded-sm flex-shrink-0"
              >
                View Usage
              </Button>
            </div>
          </div>
          <DistrictChart loading={districtLoading} />
        </div>

        <div className="mt-10 p-2 md:p-0 w-full md:w-1/2 flex flex-col gap-y-10">
          <div className="flex items-center justify-between">
            <Typography className="text-xl font-semibold w-full">
              Devices
            </Typography>
            <TextField
              size="small"
              placeholder="Device id"
              className="w-[300px]"
              value={deviceIdValue || "household-HCMC-Q1-0"}
              onInput={(e: any) => {
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
