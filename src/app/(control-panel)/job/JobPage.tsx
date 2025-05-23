import { styled } from "@mui/material/styles";
import withReducer from "@/store/withReducer";
import reducer from "./store";
import { useMediaQuery } from "@mui/material";
import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import StyledFusePageSimple from "@fuse/core/FusePageSimple";
import JobsTable from "./components/JobsTable";
import JobDetail from "./components/JobQuickView";
import JobDialog from "@/dialogs/job/JobDialog";

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

function JobPage() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    if (searchParams.get("job_id")) setRightSidebarOpen(true);
    else setRightSidebarOpen(false);
  }, [searchParams]);

  return (
    <>
      <Root
        content={<JobsTable setRightSidebarOpen={setRightSidebarOpen} />}
        rightSidebarOpen={rightSidebarOpen}
        rightSidebarContent={<JobDetail setRightSidebarOpen={setRightSidebarOpen} />}
        rightSidebarOnClose={() => setRightSidebarOpen(false)}
        rightSidebarWidth={450}
        scroll={isMobile ? "normal" : "content"}
      />
      <JobDialog />
    </>
  );
}

export default withReducer("jobs", reducer)(JobPage);
