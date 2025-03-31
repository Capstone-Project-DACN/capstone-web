import { styled } from '@mui/material/styles';
import withReducer from '@/store/withReducer';
import reducer from './store';
import { Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import StyledFusePageSimple from '@fuse/core/FusePageSimple';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import DeviceMainHeader from './components/DeviceMainHeader';
import AddDeviceForm from './components/AddDeviceForm';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

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
  
  const StickyHeader = styled(Box)(({ theme }) => ({
	position: "sticky",
	top: 0,
	backgroundColor: theme.palette.background.default,
	zIndex: 10,
	borderBottom: `1px solid ${theme.palette.divider}`,
	boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  }));

function Device() {
	const dispatch = useDispatch<AppDispatch>();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const navigation = useNavigate();
	const params = useParams();
	 
	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		event.stopPropagation();
		event.preventDefault();
		navigation(`/device/${newValue}`);
	}

	return (
		<Root
			header={<DeviceMainHeader rightSidebarOpen={rightSidebarOpen} setRightSidebarOpen={setRightSidebarOpen} />}
			content={
				<div className='w-full mt-4'>
					{params.tab}
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut tempora assumenda doloribus nam voluptatem
					harum eius laudantium ea, magni quod architecto exercitationem. Exercitationem tempore voluptate accusantium 
					vero impedit in facere.
				</div>
			}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarContent={<AddDeviceForm setRightSidebarOpen={setRightSidebarOpen}  />}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={460}
			scroll={isMobile ? "normal" : "content"}
		/>
	);
}

export default withReducer("device", reducer)(Device);
