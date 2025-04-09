import { Button,  Tab, Tabs } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { use, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import App from '@/app/App';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setTab } from './store/deviceSlice';

const DeviceHeader = (props: any) => {
	const navigation = useNavigate();
	const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const tab = useSelector((state: any) => state?.device?.deviceSlice?.tab);

    useEffect(() => {
        dispatch(setTab(params?.tab || "overview"))
    }, [params?.tab]);

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		event.stopPropagation();
		event.preventDefault();
        dispatch(setTab(newValue || "overview"))
        navigation(`/device/${newValue}`);
	}
 
    return (
        <div className='w-full flex items-center justify-between mb-5'>
            <Tabs value={tab || params?.tab} onChange={handleChange} centered>
                <Tab value={"overview"} label="Overview" />
                <Tab value={"inactive"} label="Inactive" />
                <Tab value={"add-device"} label="Add Device" />
                <Tab value={"produce"} label="Produce Data" />
            </Tabs>
        </div>
    )
}

export default DeviceHeader;