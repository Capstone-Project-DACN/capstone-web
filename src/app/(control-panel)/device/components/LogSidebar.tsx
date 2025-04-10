import { Box, Button, IconButton, styled, Typography } from "@mui/material";
import ReactJson from "react-json-view";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useSelector } from "react-redux";
import { clearLogs } from "../store/deviceSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useNavigate } from "react-router";

const StickyHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 10,
}));

const LogSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logs = useSelector((state: any) => state?.device?.deviceSlice?.logs);
  const navigate = useNavigate();

  const handleBack = () => {
    const updateParams = new URLSearchParams(window.location.search);
    updateParams.delete("logs");
    navigate(`/device/produce?${updateParams.toString()}`);
  };

  return (
    <>
      <StickyHeader className="flex items-center h-12 px-2 justify-between">
        <Button
          color="primary"
          className="font-semibold"
          startIcon={
            <FuseSvgIcon className="text-7xl" size={18} color="primary">
              heroicons-outline:arrow-left
            </FuseSvgIcon>
          }
          onClick={handleBack}
        >
          Response Logs
        </Button>
        <IconButton
          size="small"
          color="primary"
          onClick={() => dispatch(clearLogs())}
          title="Clear logs"
        >
          <FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
        </IconButton>
      </StickyHeader>
      <Box className="flex flex-col h-full px-4 pt-4">
        {/* <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(logs, null, 2)}
        </pre> */}

        <div className="space-y-4 px-1">
          {logs.map((log: any, index: any) => (
            <div key={index} className="rounded">
              <ReactJson
                src={log}
                name={false}
                collapsed={1}
                enableClipboard={false}
                iconStyle="square"
                displayDataTypes={false}
              />
            </div>
          ))}
        </div>
      </Box>
    </>
  );
};

export default LogSidebar;
