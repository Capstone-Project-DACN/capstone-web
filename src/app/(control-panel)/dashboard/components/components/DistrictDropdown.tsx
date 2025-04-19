import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import { setDistrictId } from '../../store/dashboardSlice';
import { useNavigate, useLocation } from 'react-router';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: '150px',
      margin: '3px',
    },
  },
};

const districts = [
  { label: "Quận 1", value: "area-HCMC-Q1" },
  { label: "Quận 3", value: "area-HCMC-Q3" },
  { label: "Quận 4", value: "area-HCMC-Q4" },
  { label: "Quận 5", value: "area-HCMC-Q5" },
  { label: "Quận 6", value: "area-HCMC-Q6" },
  { label: "Quận 7", value: "area-HCMC-Q7" },
  { label: "Quận 8", value: "area-HCMC-Q8" },
  { label: "Quận 10", value: "area-HCMC-Q10" },
  { label: "Quận 11", value: "area-HCMC-Q11" },
  { label: "Quận 12", value: "area-HCMC-Q12" },
  { label: "Quận Bình Tân", value: "area-HCMC-QTB" },
  { label: "Quận Bình Thạnh", value: "area-HCMC-QBTHANH" },
  { label: "Quận Gò Vấp", value: "area-HCMC-QGV" },
  { label: "Quận Phú Nhuận", value: "area-HCMC-QPN" },
  { label: "Quận Tân Phú", value: "area-HCMC-QTP" },
  { label: "TDUC - Quận 2", value: "area-TDUC-Q2" },
  { label: "TDUC - Quận 9", value: "area-TDUC-Q9" },
];

function getStyles(name: string, selectedValue: string | null, theme: any) {
  return {
    fontWeight:
      selectedValue === name
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
  };
}

export default function DistrictDropdown() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const districtId = useSelector((state: any) => state?.dashboard?.dashboardSlice?.districtId);
  const [selectedDistrict, setSelectedDistrict] = React.useState<string | null>(null);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlDistrictId = searchParams.get("district-id");
    
    if (urlDistrictId) {
      dispatch(setDistrictId(urlDistrictId));
      setSelectedDistrict(urlDistrictId);
    } else if (districtId) {
      const updateParams = new URLSearchParams(location.search);
      updateParams.set("district-id", districtId);
      navigate(`/dashboard?${updateParams}`, { replace: true });
      setSelectedDistrict(districtId);
    }
  }, [location.search, districtId, dispatch, navigate]);

  React.useEffect(() => {
    if (districtId) {
      setSelectedDistrict(districtId);
    }
  }, [districtId]);

  const handleChange = (event: { target: { value: string } }) => {
    const newDistrictId = event.target.value;
    
    // Update Redux state
    dispatch(setDistrictId(newDistrictId));
    
    // Update URL
    const updateParams = new URLSearchParams(location.search);
    updateParams.set("district-id", newDistrictId);
    navigate(`/dashboard?${updateParams}`, { replace: true });
    
    // Update local state
    setSelectedDistrict(newDistrictId);
  };

  return (
    <div>
      <Select
        displayEmpty
        sx={{ width: "150px" }}
        value={selectedDistrict || ''}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (!selected) {
            return <em>Select District</em>;
          }
          const district = districts.find(d => d.value === selected);
          return district ? district.label : 'Select District';
        }}
        MenuProps={MenuProps}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem disabled value="">
          <em>Select District</em>
        </MenuItem>
        {districts.map((district) => (
          <MenuItem
            key={district.value}
            value={district.value}
            style={getStyles(district.value, selectedDistrict, theme)}
          >
            {district.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}