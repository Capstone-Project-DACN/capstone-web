import { styled } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import StyledFusePageSimple from '@fuse/core/FusePageSimple';
import DashbaordHeader from './components/DashboardHeader';
import DashboardContent from './components/DashboardContent';
import withReducer from '@/store/withReducer';
import reducer from './store';
import { useState } from 'react';

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
    const [reloadStatus, setReloadStatus] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

    const toggleReload = () => {
        setReloadStatus(!reloadStatus);
    };
 
    return (
        <Root
            header={<DashbaordHeader toggleReload={toggleReload}/>}
            content={<DashboardContent reloadStatus={reloadStatus} />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("dashboard", reducer)(DashboardPage);
