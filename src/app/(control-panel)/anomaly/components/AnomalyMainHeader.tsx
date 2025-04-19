import { Tab, Tabs, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
// import { updateNavigationItem } from "@/components/theme-layouts/components/navigation/store/navigationSlice";

const AmomalyHeader = ({ rightSidebarOpen, setRightSidebarOpen }) => {
  const navigation = useNavigate();
  const params = useParams();
  const anomalies = useSelector(
    (state: any) => state?.anomaly?.anomalySlice?.data
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    event.stopPropagation();
    event.preventDefault();
    if(params?.id) navigation(`/anomaly/${newValue}/${params?.id}`);
    else navigation(`/anomaly/${newValue}`);
  };

  return (
    <div className="w-full flex items-center justify-between mb-5">
      <Tabs value={params?.tab || "overview"} onChange={handleChange} centered>
        <Tab value={"all"} label="All" />
        <Tab value={"district"} label="Districts" />
        <Tab value={"device"} label="Devices" />
      </Tabs>
      <Typography className="text-16 font-bold mr-3">
        {anomalies?.length} {anomalies?.length === 1 ? "Anomaly" : "Anomalies"}
      </Typography>
      {/* {!rightSidebarOpen && <Button startIcon={<FuseSvgIcon>heroicons-outline:plus-small</FuseSvgIcon>} onClick={handleShowDetail} >Add Device</Button>} */}
    </div>
  );
};

export default AmomalyHeader;
