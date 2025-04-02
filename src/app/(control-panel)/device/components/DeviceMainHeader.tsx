import { Button,  Tab, Tabs } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const DeviceMainHeader = ({rightSidebarOpen, setRightSidebarOpen}) => {
	const navigation = useNavigate();
	const params = useParams();
    const newSidebarOpen = new URLSearchParams(window.location.search).get("new") || "";
	 
	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		event.stopPropagation();
		event.preventDefault();
        const updatedParams = new URLSearchParams(location.search);
		if (newSidebarOpen === "true") navigation(`/device/${newValue}?${updatedParams}`);
        else navigation(`/device/${newValue}`);
	}

    const handleAddDevice = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setRightSidebarOpen(true);
        const updatedParams = new URLSearchParams(location.search);
        updatedParams.set("new", "true");
        navigation(`/device/${params?.tab}?${updatedParams.toString()}`);
      };

    return (
        <div className='w-full flex items-center justify-between mb-5'>
            <Tabs value={params?.tab || "overview"} onChange={handleChange} centered>
                <Tab value={"overview"} label="Overview" />
                <Tab value={"inactive"} label="Inactive" />
                <Tab value={"produce"} label="Produce Data" />
            </Tabs>
            {!rightSidebarOpen && <Button variant='contained' color="secondary" startIcon={<FuseSvgIcon>heroicons-outline:plus-small</FuseSvgIcon>} onClick={handleAddDevice} >Add Device</Button>}
        </div>
    )
}

export default DeviceMainHeader;