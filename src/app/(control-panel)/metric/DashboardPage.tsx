import { styled } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import StyledFusePageSimple from '@fuse/core/FusePageSimple';
import DashbaordHeader from './components/DashboardHeader';
import DashboardContent from './components/DashboardContent';

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
    }
  }));

function DashboardPage() {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
 
    return (
        <Root
            header={<DashbaordHeader />}
            content={<DashboardContent />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default DashboardPage
