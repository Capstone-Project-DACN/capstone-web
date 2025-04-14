import { createSlice } from "@reduxjs/toolkit";
 
export interface dahsboardSliceProps {
  cityData: null,
  districtData: null,
  diviceData: null,
  disticts: any,
  devices: any,
}

const initialState: dahsboardSliceProps = {
  cityData: null,
  districtData: null,  
  diviceData: null,
  disticts: [],
  devices: [],
};

const dahsboardSlice = createSlice({
  name: "dahsboardSlice",
  initialState,
  reducers: {
  },
}); 

export const {} = dahsboardSlice.actions;

export default dahsboardSlice.reducer;
