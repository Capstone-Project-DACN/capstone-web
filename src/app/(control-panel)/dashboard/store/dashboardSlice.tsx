import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashboardService from "@/services/dashboard/dashboardService";
import deviceService from "@/services/device/deviceService";
import anomalyService from "@/services/anomaly/anomalyService";
import { build } from "vite";
import { get } from "lodash";

export interface DashboardSliceProps {
  cityData: any;
  districtData: any;
  deviceData: any;
  districts: any[];
  devices: any[];
  timeStart: string;
  timeEnd: string;
  timeSlot: string;
  districtId: string;
  deviceId: string;
  city: string;
  noOfDevices: number,
  noOfInactiveDevices: number,
  noOfActiveAnomaly: number,
  totalCityUsage: any,
  minUsage: any, 
  maxUsage: any
}

const initialState: DashboardSliceProps = {
  cityData: null,
  districtData: null,
  deviceData: null,
  districts: [],
  devices: [],
  timeStart: "",
  timeEnd: "",  
  timeSlot: "",
  districtId: "",
  deviceId: "",
  city: "HCMC",
  noOfDevices: 0,
  noOfInactiveDevices: 0,
  noOfActiveAnomaly: 0,
  totalCityUsage: 0,
  minUsage: 0,
  maxUsage: 0
};

export const searchInactiveDevice = createAsyncThunk<any, any>(
  "device/search",
  async (params: { pageNumber?: number; pageSize?: number; dateTime?: boolean}, { getState }: any) => {
    try {
      const response = (await deviceService.searchInactiveDevice(params)) as any;

      return response?.data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const searchAnomaly = createAsyncThunk<any, any>(
  "anomaly/search",
  async (params: any, { getState }: any) => {
    try {
      const response = (await anomalyService.searchAnomaly({type : params.type})) as any;
      const anomalies = response?.data.data || [];

      return {data: anomalies};
    } catch (err) {
      console.log(err);
    }
  }
);

export const getDeviceTopics = createAsyncThunk<any, any>(
  "device/getTopics",
  async (params: any, { getState }: any) => {
      
    try {
      const response = (await deviceService.getDeviceTopics()) as any;
      return {topics: response.data.data};
    } catch (err) {
      console.log(err);
    }
  }
);

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
      time_slot: getState()?.dashboard?.dashboardSlice?.timeSlot
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
      time_slot: getState()?.dashboard?.dashboardSlice?.timeSlot
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
      state.timeSlot = action.payload;
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
      let totalCityUsage: number = 0;

      const usages = action.payload.data
        .map((item: any) => Number.parseFloat(item.usage))
        .filter((u: any) => u > 0);

      let minUsage: number = usages.length > 0 ? Math.min(...usages) : 0;
      let maxUsage: number = usages.length > 0 ? Math.max(...usages) : 0;

      const formattedData: { name: string; value: string }[] = [];

      action.payload.data.forEach((item: any) => {
        const usage = Number.parseFloat(item.usage);
        totalCityUsage += usage;

        formattedData.push({
          name: item.district,
          value: usage.toFixed(2),
        });
      });

      state.totalCityUsage = totalCityUsage.toFixed(2);
      state.minUsage = minUsage.toFixed(2);
      state.maxUsage = maxUsage.toFixed(2);
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
    builder.addCase(getDeviceTopics.fulfilled, (state, action) => {
      state.noOfDevices = action.payload.topics.reduce((total: number, item: any) => total + item.number_of_devices, 0);
    });
    builder.addCase(searchInactiveDevice.fulfilled, (state, action) => {
      state.noOfInactiveDevices = action.payload?.total;
    })
    builder.addCase(searchAnomaly.fulfilled, (state, action) => {
      state.noOfActiveAnomaly = action.payload?.data?.length;
    })
  },
}); 

export const { setTimeStart, setTimeEnd, setTimeSlot, setDistrictId, setDeviceId } = dashboardSlice.actions;
export default dashboardSlice.reducer;

