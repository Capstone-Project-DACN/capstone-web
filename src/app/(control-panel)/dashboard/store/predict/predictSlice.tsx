import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashboardService from "@/services/dashboard/dashboardService";
import { set } from "lodash";

export interface DashboardSliceProps {
  dailyData: any;
  predictDailyData: any;
  timeStart: string;
  timeEnd: string;
  deviceId: string;
  allDate: any
}

const initialState: DashboardSliceProps = {
  timeStart: new Date().toISOString(),
  timeEnd: new Date().toISOString(),  
  deviceId: "area-HCMC-Q10",
  dailyData : [],
  predictDailyData : [],
  allDate : []
};

export const getDailyData = createAsyncThunk(
  "prediction/getDailyData",
  async (params: any, { getState }: any) => {
    const searchParams: any = {
      time_start: getState()?.predict?.predictSlice?.timeStart,
      time_end: getState()?.predict?.predictSlice?.timeEnd,
      device_id:  getState()?.predict?.predictSlice?.deviceId || "area-HCMC-Q10"
    }

    try {
      const response: any = await dashboardService.getDailyData(searchParams);
      console.log("prediction/getDailyData", { response });
      return { data: response?.data };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
);

export const getPredictDailyData = createAsyncThunk(
  "prediction/getPredictDailyData",
  async (params: any, { getState }: any) => {
    const searchParams: any = {
      time_start: getState()?.predict?.predictSlice?.timeStart,
      time_end: getState()?.predict?.predictSlice?.timeEnd,
      device_id:  getState()?.predict?.predictSlice?.deviceId || "area-HCMC-Q10"
    }

    try {
      const response: any = await dashboardService.getPredictDailyData(searchParams);
      console.log("prediction/getPredictDailyData", { response });
      return { data: response?.data };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
);
 
 
const predictSlice = createSlice({
  name: "predictSlice",
  initialState,
  reducers: {
    setTimeStart(state, action) {
      state.timeStart = action.payload;
    },
    setTimeEnd(state, action) {
      state.timeEnd = action.payload;
    },
    setDeviceId(state, action) {
      state.deviceId = action.payload;
    },
    setAllDate(state, action) {
      state.allDate = action.payload;
    }, 
    resetPredictData(state) {
      state.predictDailyData = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDailyData.fulfilled, (state, action) => {
      const formattedData = action.payload.data.map((item: any) => {
        return {
          value: Number.parseFloat(item.usage).toFixed(2),
          date: item.start_utc.split('T')[0]
        }
      })
      state.dailyData = formattedData;
    });
    builder.addCase(getPredictDailyData.fulfilled, (state, action) => {
      const formattedData = action.payload.data.map((item: any) => {
        return {
          value: Number.parseFloat(item.daily_usage).toFixed(2),
          date: item?.date_part
        }
      })
      state.predictDailyData = formattedData;
    });
  }
});

export const { setTimeStart, setTimeEnd, setDeviceId, setAllDate, resetPredictData } = predictSlice.actions;
export default predictSlice.reducer;

