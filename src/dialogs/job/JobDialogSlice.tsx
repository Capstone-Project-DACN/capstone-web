import { createSlice } from "@reduxjs/toolkit";

export interface jobDialogSliceProps {
  data: [],
  props: any,
  loading: boolean
}

const initialState: jobDialogSliceProps = {
  data: [],
  props: {
    open: false
  },
  loading: false
};

const jobDialogSlice = createSlice({
  name: "jobDialogSlice",
  initialState,
  reducers: {
    openJobDialog(state, action) {
      state.props.open = true;
    },
    closeJobDialog(state, action) {
      state.props.open = false;
    },
  },
}); 

export const { 
    openJobDialog,
    closeJobDialog
} = jobDialogSlice.actions;

export default jobDialogSlice.reducer;
