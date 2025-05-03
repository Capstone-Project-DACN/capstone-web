import { Button, Tab, Tabs, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { addLogs, setTab } from "./store/deviceSlice";
import { DatePicker } from "@mui/x-date-pickers";
import { set } from "lodash";
import { useThemeMediaQuery } from "@fuse/hooks";

interface DeviceData {
  id: string;
  type: string;
  city: string;
  district: string;
  householdId?: string;
  expanded: boolean;
  response?: any;
  loading: boolean;
}

const parseDeviceInfo = (deviceId: string): DeviceData => {
  const parts = deviceId.split("-");
  const type = parts[0];
  const city = parts[1];
  const district = parts[2];
  const householdId = type === "household" ? parts[3] : undefined;

  return {
    id: deviceId,
    type,
    city,
    district,
    householdId,
    expanded: false,
    loading: false,
  };
};

const DeviceHeader = (props: any) => {
  const navigation = useNavigate();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("md"));
  const tab = useSelector((state: any) => state?.device?.deviceSlice?.tab);
  const logs = new URLSearchParams(window.location.search).get("logs");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const custom_date =
    new URLSearchParams(window.location.search).get("custom_date") ||
    new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const selectedDevices = useSelector(
    (state: any) => state?.device?.deviceSlice?.selectedDevices || []
  );

  useEffect(() => {
    if (localStorage.getItem("custom_date")) {
      setDate(localStorage.getItem("custom_date"));
    } else {
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, []);

  useEffect(() => {
    const updateParams = new URLSearchParams(window.location.search);
    updateParams.set("custom_date", date);
    navigate(`/device/produce?${updateParams.toString()}`);
  }, [date]);

  useEffect(() => {
    dispatch(setTab(params?.tab || "overview"));
  }, [params?.tab]);

  const handleShowLogs = () => {
    const updatedParams = new URLSearchParams(window.location.search);
    const currentState = updatedParams.get("logs");
    if (currentState === "true") {
      updatedParams.delete("logs");
    } else {
      updatedParams.set("logs", "true");
    }
    navigate(`/device/produce?${updatedParams.toString()}`);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(setTab(newValue || "overview"));
    navigation(`/device/${newValue}`);
  };

  const sendData = async (device: DeviceData, isAnomaly: boolean = false) => {
    const action =
      device.type === "household"
        ? isAnomaly
          ? "Send Anomaly"
          : "Send Normal"
        : "Send Area Data";

    try {
      let url = "";
      if (device.type === "household") {
        url = isAnomaly
          ? `${import.meta.env.VITE_BASE_JOB_SERVICE}/data/anomaly?batch_size=1&city_id=${device.city}&district_id=${device.district}&display_data=true&id=${device.householdId}&custom_date=${custom_date}`
          : `${import.meta.env.VITE_BASE_JOB_SERVICE}/data/household?batch_size=1&city_id=${device.city}&district_id=${device.district}&display_data=true&id=${device.householdId}&custom_date=${custom_date}`;
      } else if (device.type === "area") {
        url = `${import.meta.env.VITE_BASE_JOB_SERVICE}/data/area?batch_size=1&city_id=${device.city}&district_id=${device.district}&display_data=true&custom_date=${custom_date}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      localStorage.setItem(
        "logs",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("logs") || "[]"),
          data,
        ])
      );
      dispatch(addLogs(data));
    } catch (error: any) {
      console.error(error);
    } finally {
    }
  };

  const handleSenALlData = () => {
    const devices = selectedDevices.map(parseDeviceInfo);
    setLoading(true);
    Promise.all(devices.map((device: any) => sendData(device, false))).then(
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col items-start justify-between mb-5">
      <div className="w-full flex items-center justify-between">
        <Tabs value={tab || params?.tab} onChange={handleChange} centered>
          <Tab value={"overview"} label="Overview" />
          <Tab value={"inactive"} label="Inactive" />
          <Tab value={"add-device"} label="Add Device" />
          <Tab value={"produce"} label="Produce Data" />
        </Tabs>
        {tab === "produce" && !isMobile && (
          <div className="mr-4 pt-4 flex items-center gap-x-5 transition-all duration-300 ease-in">
            <div className="flex items-center gap-x-2">
              <DatePicker
                value={new Date(date)}
                onChange={(e: any) => {
                  setDate(e.toISOString().split("T")[0]);
                  localStorage.setItem(
                    "custom_date",
                    e.toISOString().split("T")[0]
                  );
                }}
                slotProps={{
                  textField: { size: "medium" },
                }}
              />

              <Button
                disabled={loading}
                color="primary"
                variant="contained"
                className="rounded-sm"
                onClick={handleSenALlData}
              >
                Send all
              </Button>
            </div>

            <Button
              endIcon={
                <FuseSvgIcon className="text-7xl" size={18} color="primary">
                  heroicons-outline:arrow-right
                </FuseSvgIcon>
              }
              onClick={handleShowLogs}
              className="font-semibold"
              size="small"
              color="primary"
            >
              Responses logs
            </Button>
          </div>
        )}
      </div>
      {tab === "produce" && isMobile && (
          <div className="mr-4 pt-2 px-3 flex items-center gap-x-5 transition-all duration-300 ease-in">
            <div className="flex items-center gap-x-2">
              <DatePicker
                value={new Date(date)}
                onChange={(e: any) => {
                  setDate(e.toISOString().split("T")[0]);
                  localStorage.setItem(
                    "custom_date",
                    e.toISOString().split("T")[0]
                  );
                }}
                slotProps={{
                  textField: { size: "medium" },
                }}
              />

              <Button
                disabled={loading}
                color="primary"
                variant="contained"
                className="rounded-sm min-w-24"
                onClick={handleSenALlData}
              >
                Send all
              </Button>
            </div>

            <Button
              endIcon={
                <FuseSvgIcon className="text-7xl" size={18} color="primary">
                  heroicons-outline:arrow-right
                </FuseSvgIcon>
              }
              onClick={handleShowLogs}
              className="font-semibold"
              size="small"
              color="primary"
            >
              {isMobile ? "Logs" : "Responses logs"}
            </Button>
          </div>
        )}
    </div>
  );
};

export default DeviceHeader;
