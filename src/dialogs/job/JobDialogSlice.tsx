import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jobService from "@/services/job/jobService"
import { any } from "zod";

export interface jobDialogSliceProps {
  data: any,
  props: any,
  loading: boolean
}

const initialState: jobDialogSliceProps = {
  data: null,
  props: {
    open: false
  },
  loading: false
};

export const getDistributionData = createAsyncThunk<any, any>(
  "cronjob/getDistributionData",
  async (params: {job : any}, { getState }: any) => {
    try {
      const response = (await jobService.getDistributionData(params)) as any;
      return {data: response.data};
    } catch (err) {
      console.log(err);
    }
  }
);



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
  extraReducers: (builder) => {
    builder.addCase(getDistributionData.fulfilled, (state, action: any) => {
      state.data = {
        data: {
          chart_data: action.payload.data?.data?.chart_data
        }
      };
    })
    }
}); 

export const { 
    openJobDialog,
    closeJobDialog
} = jobDialogSlice.actions;

export default jobDialogSlice.reducer;
