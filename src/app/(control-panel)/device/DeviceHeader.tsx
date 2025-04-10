import { Button, Tab, Tabs } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import App from "@/app/App";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setTab } from "./store/deviceSlice";
import { divide } from "lodash";

const DeviceHeader = (props: any) => {
  const navigation = useNavigate();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const tab = useSelector((state: any) => state?.device?.deviceSlice?.tab);
  const logs = new URLSearchParams(window.location.search).get("logs");
  const navigate = useNavigate();

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

  return (
    <div className="w-full flex items-center justify-between mb-5">
      <Tabs value={tab || params?.tab} onChange={handleChange} centered>
        <Tab value={"overview"} label="Overview" />
        <Tab value={"inactive"} label="Inactive" />
        <Tab value={"add-device"} label="Add Device" />
        <Tab value={"produce"} label="Produce Data" />
      </Tabs>
      {tab === "produce" && !logs && (
        <div className="mr-4 pt-4 transition-all duration-300 ease-in">
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
  );
};

export default DeviceHeader;
