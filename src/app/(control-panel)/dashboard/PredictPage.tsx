import { styled } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import StyledFusePageSimple from "@fuse/core/FusePageSimple";
import PredictHeader from "./components/PredictHeader";
import PredictContent from "./components/PredictContent";
import withReducer from "@/store/withReducer";
import reducer from "./store/predict";
import { use, useEffect } from "react";
import { useLocation } from "react-router";

const Root = styled(StyledFusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
  },
  "& .FusePageSimple-content": {
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
    paddingTop: 0,
  },
  "& .container": {
    backgroundColor: theme.palette.background.paper,
  },
}));

function PredictPage() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const location = useLocation();
  
  useEffect(() => {
    localStorage.setItem("fullURL_predict", location.pathname + location.search);
  }, [location?.pathname, location?.search]);

  return (
    <Root
      header={<PredictHeader/>}
      content={<PredictContent />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("predict", reducer)(PredictPage);

