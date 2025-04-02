import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import deviceService from "@/services/device/deviceService"
import _ from "lodash";

export const searchInactiveDevice = createAsyncThunk<any, any>(
  "device/search",
  async (params: { pageNumber?: number; pageSize?: number; dateTime?: boolean}, { getState }: any) => {
    try {
      const response = (await deviceService.searchInactiveDevice(params)) as any;

      const inactiveDevices = response?.inactiveDevices || [];
      const inactive_thresold = response?.inactive_thresold;

      return {data: inactiveDevices, inactive_thresold};
    } catch (err) {
      console.log(err);
    }
  }
);

export const addAreaDevice = createAsyncThunk<any, any>(
  "device/addAreaDevice",
  async (params: { deviceId: string }, { getState }: any) => {
    
    try {
      const response = (await deviceService.addAreaDevice(params)) as any;
      return response;
    } catch (err) {
      console.log(err);
    }
  }
);

export const addHouseholdDevice = createAsyncThunk<any, any>(
    "device/addHouseholdDevice",
    async (params: {
      start?: number;
      end?: number;
      prefix?: string;
    }, { getState }: any) => {
      const payload = {
        start: params?.start ? params?.start : 0,
        end: params?.end ? params?.end : 10,
        prefix: params?.prefix
      };
        
      try {
        const response = (await deviceService.addHouseholdDevices(payload)) as any;
        return response;
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
      console.log(response.topics);
      return {topics: response.topics};
    } catch (err) {
      console.log(err);
    }
  }
);

export const getDeviceByTopic = createAsyncThunk<any, any>(
  "device/getDeviceByTopic",
  async (params: {topic: string}, { getState }: any) => {
      
    try {
      const response = (await deviceService.getDevicesByTopic(params)) as any;
      console.log(response?.devices);
      return {devices: response?.devices};
    } catch (err) {
      console.log(err);
    }
  }
);
 
interface deviceSliceState {
  data: [],
  topics: [],
  loading: boolean,
  searchText: any,
  totalElements: number,
  totalPages: number,
  pagination: {
    page: number;
    size: number;
    sortBy: string;
    direction: string;
  };
  filter: {},
}

const initialState: deviceSliceState = {
  data: [],
  loading: false,
  topics: [],
  searchText: '',
  totalElements: 0,
  totalPages: 0,
  pagination: {
    page: 0,
    size: 10,
    sortBy: "createdDate",
    direction: "DESC",
  },
  filter: {}, 
};

const deviceSlice = createSlice({
  name: "deviceSlice",
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
    setPagination: (state: any, action) => {
      state.pagination = {
        page: action.payload.page ? parseInt(action.payload.page) : 0,
        size: action.payload.size ? parseInt(action.payload.size) : 10,
      };
    },
    setSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({
				payload: event.target.value || '',
				meta: undefined,
				error: null
			}),
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    resetSearchText: (state) => {
      state.searchText = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchInactiveDevice.fulfilled, (state, action: any) => {
      state.data = action.payload.data;
      state.inactive_thresold = action.payload.inactive_thresold;
    });
    builder.addCase(addHouseholdDevice.fulfilled, (state, action: any) => {
      // state.feedDetail.data = action.payload;
    });
    builder.addCase(addAreaDevice.fulfilled, (state, action: any) => {
      // state.feedDetail.data = action.payload;
    });
    builder.addCase(getDeviceTopics.fulfilled, (state, action: any) => {
      state.topics = action.payload.topics;
    });
    builder.addCase(getDeviceByTopic.fulfilled, (state, action: any) => {
      state.data = action.payload.devices;
    });
  },
}); 

export const { 
  setData,
  setPagination,
  setSearchText,
  setFilter,
  resetSearchText
} = deviceSlice.actions;

export default deviceSlice.reducer;
