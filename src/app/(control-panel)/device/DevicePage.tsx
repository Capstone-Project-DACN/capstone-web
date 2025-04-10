import { styled } from '@mui/material/styles';
import withReducer from '@/store/withReducer';
import reducer from './store';
import { useMediaQuery } from '@mui/material';
import { useLocation, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import StyledFusePageSimple from '@fuse/core/FusePageSimple';
import DeviceHeader from './DeviceHeader';
import AddDevice from './components/components/AddDevice';
import DeviceContent from './DeviceContent';
import LogSidebar from './components/LogSidebar';

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

function DevicePage() {
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const searchParams = new URLSearchParams(window.location.search);
	const params = useParams();
	const logs = searchParams.get("logs");
 
	return (
		<Root
			header={<DeviceHeader />}
			content={<DeviceContent />}
			rightSidebarOpen={logs === "true" && params.tab === "produce"}
			rightSidebarContent={<LogSidebar />}
			rightSidebarWidth={450}
			scroll={isMobile ? "normal" : "content"}
			className='text-sm'
		/>
	);
}

export default withReducer("device", reducer)(DevicePage);
