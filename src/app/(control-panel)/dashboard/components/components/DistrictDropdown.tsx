import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const districts = [
  { label: "Quận 1", value: "hcm-q1" },
  { label: "Quận 3", value: "hcm-q3" },
  { label: "Quận 4", value: "hcm-q4" },
  { label: "Quận 5", value: "hcm-q5" },
  { label: "Quận 6", value: "hcm-q6" },
  { label: "Quận 7", value: "hcm-q7" },
  { label: "Quận 8", value: "hcm-q8" },
  { label: "Quận 10", value: "hcm-q10" },
  { label: "Quận 11", value: "hcm-q11" },
  { label: "Quận 12", value: "hcm-q12" },
  { label: "Quận Bình Tân", value: "hcm-binhtan" },
  { label: "Quận Bình Thạnh", value: "hcm-binhthanh" },
  { label: "Quận Gò Vấp", value: "hcm-govap" },
  { label: "Quận Phú Nhuận", value: "hcm-phunhuan" },
  { label: "Quận Tân Bình", value: "hcm-tanbinh" },
  { label: "Quận Tân Phú", value: "hcm-tanphu" },
  { label: "TP Thủ Đức", value: "hcm-thuduc" },
  { label: "Huyện Bình Chánh", value: "hcm-binhchanh" },
  { label: "Huyện Cần Giờ", value: "hcm-cangio" },
  { label: "Huyện Củ Chi", value: "hcm-cuchi" },
  { label: "Huyện Hóc Môn", value: "hcm-hocmon" },
  { label: "Huyện Nhà Bè", value: "hcm-nhabe" },
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName && personName.value === name
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
  };
}

export default function DistrictDropdown() {
  const theme = useTheme();
  const [selectedDistrict, setSelectedDistrict] = React.useState("");

  const handleChange = (event: any) => {
    setSelectedDistrict(event.target.value);
  };

  return (
    <div>
      <Select
        displayEmpty
        sx={{ width: "150px" }}
        value={selectedDistrict}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (!selected) {
            return <em>Select District</em>;
          }
          const district = districts.find(d => d.value === selected);
          return district ? district.label : '';
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