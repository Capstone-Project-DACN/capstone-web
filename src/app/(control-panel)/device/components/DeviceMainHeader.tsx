import { Button,  Tab, Tabs } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const DeviceMainHeader = ({rightSidebarOpen, setRightSidebarOpen}) => {
	const navigation = useNavigate();
	const params = useParams();
	 
	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		event.stopPropagation();
		event.preventDefault();
		navigation(`/device/${newValue}`);
	}

    return (
        <div className='w-full flex items-center justify-between mb-5'>
            <Tabs value={params?.tab || "overview"} onChange={handleChange} centered>
                <Tab value={"overview"} label="Overview" />
                <Tab value={"districts"} label="Districts" />
                <Tab value={"inactive"} label="Inactive" />
            </Tabs>
            {!rightSidebarOpen && <Button startIcon={<FuseSvgIcon>heroicons-outline:plus-small</FuseSvgIcon>} onClick={() => {setRightSidebarOpen(true)}} >Add Device</Button>}
        </div>
    )
}

export default DeviceMainHeader;