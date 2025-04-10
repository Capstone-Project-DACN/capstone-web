import {
  Box,
  Button,
  IconButton,
  styled,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  addLogs,
  removeSelectedDevice,
  setSelectedDevices,
} from "../../store/deviceSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useNavigate } from "react-router";


const StickyHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.default,
  zIndex: 10,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
}));

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

const ProduceTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();
  const selectedDevices = useSelector(
    (state: any) => state?.device?.deviceSlice?.selectedDevices || []
  );

  const handleShowLogs = () => {
    const updatedParams = new URLSearchParams(window.location.search);
    const currentState = updatedParams.get("logs");
    if (currentState === "true") {
      updatedParams.delete("logs");
    } else {
      updatedParams.set("logs", "true");
    }
    navigate(`/device/produce?${updatedParams.toString()}`);
  }

  useEffect(() => {
    if (!selectedDevices.length && !localStorage.getItem("selectedDevices"))
      return;

    if (
      selectedDevices.length === 0 &&
      localStorage.getItem("selectedDevices")
    ) {
      const storedDevices = JSON.parse(
        localStorage.getItem("selectedDevices") || "[]"
      );
      dispatch(setSelectedDevices(storedDevices));
    }

    const deviceLoading = selectedDevices.reduce(
      (acc: any, deviceId: string) => {
        acc[deviceId] = false;
        return acc;
      },
      {}
    );

    setLoading(deviceLoading);
  }, []);

  useEffect(() => {
    if (!selectedDevices.length) return;
    localStorage.setItem("selectedDevices", JSON.stringify(selectedDevices));
  }, [selectedDevices]);

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

  const sendData = async (device: DeviceData, isAnomaly: boolean = false) => {
    const action =
      device.type === "household"
        ? isAnomaly
          ? "Send Anomaly"
          : "Send Normal"
        : "Send Area Data";

    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [device.id]: true,
      }));

      let url = "";
      if (device.type === "household") {
        url = isAnomaly
          ? `http://localhost:3000/data/anomaly?batch_size=1&city_id=${device.city}&district_id=${device.district}&display_data=true&id=${device.householdId}`
          : `http://localhost:3000/data/household?batch_size=1&city_id=${device.city}&district_id=${device.district}&display_data=true&id=${device.householdId}`;
      } else if (device.type === "area") {
        url = `http://localhost:3000/data/area?batch_size=1&city_id=${device.city}&district_id=${device.district}&display_data=true`;
      }

      const response = await fetch(url);
      const data = await response.json();
      localStorage.setItem("logs", JSON.stringify([...JSON.parse(localStorage.getItem("logs") || "[]"), data]))
      dispatch(addLogs(data));
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [device.id]: false,
      }));
    }
  };

  return (
    <div className="px-4 h-full overflow-y-scroll scrollbar-hide">
      <StickyHeader className="border-t border-r border-l rounded-t-md">
        <motion.div
          className="flex items-center font-semibold justify-between h-12 px-4 text-blue-600 uppercase"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-1/10 flex items-center">Type</div>
          <div className="w-1/10 flex items-center">City</div>
          <div className="w-1/10 flex items-center">District</div>
          <div className="w-1/10 flex items-center">ID</div>
          <div className="w-2/10 flex items-center">Normal</div>
          <div className="w-2/10 flex items-center">Anomaly</div>
          <div className="w-1/22 flex items-center">
            <Tooltip title="View Logs">
              <IconButton onClick={handleShowLogs}>
                <FuseSvgIcon className="text-7xl" size={18} color="primary">
                  heroicons-solid:code-bracket
                </FuseSvgIcon>
              </IconButton>
            </Tooltip>
          </div>
        </motion.div>
      </StickyHeader>

      <div className="flex flex-col">
        {selectedDevices.map((dev: any) => {
          const device = parseDeviceInfo(dev);
          return (
            <Box
              sx={{
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
              key={device.id}
              className="border border-t-0 h-14 px-4 flex items-center w-full justify-between"
            >
                <Typography className="w-1/10 flex items-center gap-x-2">
                  {device.type == "household" && (
                    <FuseSvgIcon className="text-7xl" size={18}>
                      heroicons-outline:building-office
                    </FuseSvgIcon>
                  )}
                  {device.type == "area" && (
                    <FuseSvgIcon className="text-7xl" size={18}>
                      heroicons-outline:globe-asia-australia
                    </FuseSvgIcon>
                  )}
                  {device.type}
                </Typography>
                <Typography className="w-1/10 flex items-center">{device.city}</Typography>
                <Typography className="w-1/10 flex items-center font-semibold">
                  {device.district}
                </Typography>
                <Typography className="w-1/10 flex items-center">
                  {device.householdId || "-"}
                </Typography>
                <Typography className="w-2/10 flex items-center">
                  {device.type === "household" ? (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => sendData(device)}
                      disabled={loading[dev]}
                      startIcon={
                        <FuseSvgIcon
                          className="text-7xl"
                          size={18}
                          color="primary"
                        >
                          heroicons-solid:signal
                        </FuseSvgIcon>
                      }
                    >
                      {device.loading ? "Loading..." : "Send Normal"}
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => sendData(device)}
                      startIcon={
                        <FuseSvgIcon
                          className="text-7xl"
                          size={18}
                          color="primary"
                        >
                          heroicons-solid:signal
                        </FuseSvgIcon>
                      }
                      disabled={loading[dev]}
                    >
                      {device.loading ? "Loading..." : "Send Area Data"}
                    </Button>
                  )}
                </Typography>
                <Typography className="w-2/10 flex items-center">
                  {device.type === "household" && (
                    <Button
                      size="small"
                      color="warning"
                      onClick={() => sendData(device, true)}
                      disabled={loading[dev]}
                      startIcon={
                        <FuseSvgIcon
                          className="text-7xl"
                          size={18}
                          color="warning"
                        >
                          heroicons-outline:bug-ant
                        </FuseSvgIcon>
                      }
                    >
                      {device.loading ? "Loading..." : "Send Anomaly"}
                    </Button>
                  )}
                </Typography>
                <Typography className="w-1/22 flex items-center">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      dispatch(removeSelectedDevice(dev));
                    }}
                    disabled={loading[dev]}
                  >
                    <FuseSvgIcon className="text-7xl" size={18} color="error">
                      heroicons-outline:trash
                    </FuseSvgIcon>
                  </IconButton>
                </Typography>
            </Box>
          );
        })}
      </div>

      {selectedDevices.length === 0 && (
        <div className="text-center py-6  rounded">
          No devices selected. Please select devices to produce data.
        </div>
      )}
    </div>
  );
};

export default ProduceTab;
