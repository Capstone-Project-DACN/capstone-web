import { styled } from '@mui/material/styles';
import withReducer from '@/store/withReducer';
import reducer from './store';
import { useMediaQuery } from '@mui/material';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import StyledFusePageSimple from '@fuse/core/FusePageSimple';
import AnomalyMainHeader from './components/AnomalyMainHeader';
import AnomalyDetail from './components/AnomalyDetail';
import AnomalyMainContent from './components/AnomalyMainContent';

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

function AnomalyPage() {
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const params = useParams();

	useEffect(() => {
		if(params?.id) setRightSidebarOpen(true);
		else setRightSidebarOpen(false);
	}, [params?.id]);
 
	return (
		<Root
			header={<AnomalyMainHeader rightSidebarOpen={rightSidebarOpen} setRightSidebarOpen={setRightSidebarOpen} />}
			content={<AnomalyMainContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarContent={<AnomalyDetail setRightSidebarOpen={setRightSidebarOpen}  />}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={500}
			rightSidebarVariant={isMobile ? "temporary" : "permanent"}
			scroll={isMobile ? "normal" : "content"}
		/>
	);
}

export default withReducer("anomaly", reducer)(AnomalyPage);
