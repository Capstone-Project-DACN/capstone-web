import { Tab, Tabs } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
// import { updateNavigationItem } from "@/components/theme-layouts/components/navigation/store/navigationSlice";

const AmomalyHeader = ({ rightSidebarOpen, setRightSidebarOpen }) => {
  const navigation = useNavigate();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const newSidebarOpen =
    new URLSearchParams(window.location.search).get("new") || "";

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    event.stopPropagation();
    event.preventDefault();
    navigation(`/anomaly/${newValue}`);
  };

  return (
    <div className="w-full flex items-center justify-between mb-5">
      <Tabs value={params?.tab || "overview"} onChange={handleChange} centered>
        <Tab value={"all"} label="All" />
        <Tab value={"district"} label="District" />
        <Tab value={"household"} label="Household" />
      </Tabs>
      {/* <Button
        onClick={() => {
          dispatch(
            updateNavigationItem("dashboards.anomaly", {
              badge: {
                title: `${2}`,
              },
            })
          );
        }}
        variant="contained"
        color="secondary"
      >
        Update Navigation Item
      </Button> */}
      {/* {!rightSidebarOpen && <Button startIcon={<FuseSvgIcon>heroicons-outline:plus-small</FuseSvgIcon>} onClick={handleShowDetail} >Add Device</Button>} */}
    </div>
  );
};

export default AmomalyHeader;
