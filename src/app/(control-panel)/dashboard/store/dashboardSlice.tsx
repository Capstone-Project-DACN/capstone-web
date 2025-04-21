import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashboardService from "@/services/dashboard/dashboardService";
import { set } from "lodash";
import { time } from "console";

export interface DashboardSliceProps {
  cityData: any;
  districtData: any;
  deviceData: any;
  districts: any[];
  devices: any[];
  timeStart: string;
  timeEnd: string;
  timeslot: string;
  districtId: string;
  deviceId: string;
  city: string;
}

const initialState: DashboardSliceProps = {
  cityData: null,
  districtData: null,
  deviceData: null,
  districts: [],
  devices: [],
  timeStart: "",
  timeEnd: "",  
  timeslot: "",
  districtId: "",
  deviceId: "",
  city: "HCMC",
};

export const getCityData = createAsyncThunk(
  "dashboard/getCityData",
  async (params: any, { getState }: any) => {
    const searchParams = {
      time_start: getState()?.dashboard?.dashboardSlice?.timeStart,
      time_end: getState()?.dashboard?.dashboardSlice?.timeEnd,
      city:  getState()?.dashboard?.dashboardSlice?.city || "HCMC"
    }

    console.log({ searchParams });

    try {
      const response: any = await dashboardService.getCityData(searchParams);
      console.log({ response });
      return { data: response?.data };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
);

export const getUsageDataByDeviceId = createAsyncThunk(
  "dashboard/getUsageDataByDeviceId",
  async (params: any, {getState}: any) => {
    const searchParams = {
      time_start: getState()?.dashboard?.dashboardSlice?.timeStart,
      time_end: getState()?.dashboard?.dashboardSlice?.timeEnd,
      device_id: getState()?.dashboard?.dashboardSlice?.deviceId,
      time_slot: getState()?.dashboard?.dashboardSlice?.timeslot
    }

    try {
      const response: any = await dashboardService.getUsageDataByDeviceId(searchParams);
      console.log({ response });
      return { data: response?.data?.data };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
);

export const getUsageDataByDistrictId = createAsyncThunk(
  "dashboard/getUsageDataByDistrictId", 
  async (params: any, {getState}: any) => {
    const searchParams = {
      time_start: getState()?.dashboard?.dashboardSlice?.timeStart,
      time_end: getState()?.dashboard?.dashboardSlice?.timeEnd,
      district_id: getState()?.dashboard?.dashboardSlice?.districtId,
      time_slot: getState()?.dashboard?.dashboardSlice?.timeslot
    }

    try {
      const response: any = await dashboardService.getUsageDataByDistrictId(searchParams);
      console.log({ response });
      return { data: response?.data?.data };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {
    setTimeStart(state, action) {
      state.timeStart = action.payload;
    },
    setTimeEnd(state, action) {
      state.timeEnd = action.payload;
    },
    setTimeSlot(state, action) {
      state.timeslot = action.payload;
    },
    setDistrictId(state, action) {
      state.districtId = action.payload;
    },
    setDeviceId(state, action) {
      state.deviceId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCityData.fulfilled, (state, action) => {
      const formattedData = action.payload.data.map((item: any) => {
        return {
          name: item.district,
          value: Number.parseFloat(item.usage).toFixed(2)
        }
      })
      state.cityData = formattedData;
    });
    builder.addCase(getUsageDataByDeviceId.fulfilled, (state, action) => {
      const formmatedData = action.payload.data.map((item: any) => {
        const utcDate = new Date(item.x_utc_timestamp);
        const vietnamTime = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));
        return {
          x:  vietnamTime,
          y: item.electricity_usage
        }
      })
      state.deviceData = formmatedData;
    });
    builder.addCase(getUsageDataByDistrictId.fulfilled, (state, action) => {
    
      const formmatedData = action.payload.data.map((item: any) => {
        const utcDate = new Date(item.x_utc_timestamp);
        const vietnamTime = new Date(utcDate.getTime() + (7 * 60 * 60 * 1000));
        return {
          x:  vietnamTime,
          y: item.electricity_usage
        }
      })
      state.districtData = formmatedData;
    });
  },
});

export const { setTimeStart, setTimeEnd, setTimeSlot, setDistrictId, setDeviceId } = dashboardSlice.actions;
export default dashboardSlice.reducer;

