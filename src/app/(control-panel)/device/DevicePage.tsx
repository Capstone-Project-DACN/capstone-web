import { styled } from '@mui/material/styles';
import withReducer from '@/store/withReducer';
import reducer from './store';
import { useMediaQuery } from '@mui/material';
import { useParams } from 'react-router';
import { useState } from 'react';
import StyledFusePageSimple from '@fuse/core/FusePageSimple';
import DeviceMainHeader from './components/DeviceMainHeader';
import AddDeviceForm from './components/AddDeviceForm';
import DeviceMainContent from './components/DeviceMainContent';

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
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const params = useParams();
 
	return (
		<Root
			header={<DeviceMainHeader rightSidebarOpen={rightSidebarOpen} setRightSidebarOpen={setRightSidebarOpen} />}
			content={<DeviceMainContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarContent={<AddDeviceForm setRightSidebarOpen={setRightSidebarOpen}  />}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={460}
			scroll={isMobile ? "normal" : "content"}
		/>
	);
}

export default withReducer("device", reducer)(DevicePage);
