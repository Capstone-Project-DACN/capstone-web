import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import deviceService from "@/services/device/deviceService"
import _, { remove } from "lodash";
import { clear } from "console";

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
      return {topics: response.data.data};
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
      return {devices: response?.data?.data};
    } catch (err) {
      console.log(err);
    }
  }
);

export const getDeviceDetail = createAsyncThunk<any, any>(
  "device/getDeviceDetail",
  async (params: {deviceId: any}, { getState }: any) => {
      
    try {
      const response = (await deviceService.getDeviceDetail(params)) as any;

      console.log({response});

      return {detail: response?.data};
    } catch (err) {
      console.log(err);
    }
  }
);

export const removeDevice = createAsyncThunk<any, any>(
  "device/removeDevice",
  async (params: {deviceId: any, topic: any}, { getState }: any) => {
      
    try {
      const response = (await deviceService.removeDevice({deviceId: params.deviceId})) as any;

      console.log({response});

      return {deviceId: params.deviceId, topic: params.topic};
    } catch (err) {
      console.log(err);
    }
  }
);
 
interface deviceSliceState {
  tab: string,
  data: [],
  inactiveData: [],
  topics: [],
  loading: boolean,
  searchText: any,
  detail : any,
  totalElements: number,
  totalPages: number,
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number
  };
  filter: {},
  selectedDevices: [],
  logs: [],
}

const initialState: deviceSliceState = {
  tab: "overview",
  data: [],
  inactiveData: [],
  loading: false,
  topics: [],
  detail: null,
  searchText: '',
  totalElements: 0,
  totalPages: 0,
  pagination: {
    pageNumber: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 10
  },
  filter: {}, 
  selectedDevices: [],
  logs: [],
};

const deviceSlice = createSlice({
  name: "deviceSlice",
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
    setTab(state, action) {
      state.tab = action.payload;
    },
    addLogs(state: any, action: any) {
      state.logs = [...state.logs, action.payload];
    },
    clearLogs(state: any) {
      state.logs = [];
    },
    setLogs(state: any, action: any) {
      state.logs = action.payload;
    },
    addSelectedDevice(state: any, action: any) {
      const exited = state.selectedDevices.find((item: any) => item === action.payload);
      if(!exited) state.selectedDevices = [...state.selectedDevices, action.payload];
    },
    removeSelectedDevice(state: any, action: any) {
      state.selectedDevices = state.selectedDevices.filter((item: any) => item !== action.payload);
    },
    setSelectedDevices(state: any, action: any) {
      state.selectedDevices = action.payload;
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
      state.inactiveData = action.payload.inactiveDevices;
      state.inactive_thresold = action.payload.inactive_thresold;
      state.pagination.totalPages  = action.payload.totalPages;
      state.pagination.total  = action.payload.total;
      state.pagination.pageNumber  = action.payload.pageNumber;
      state.pagination.pageSize  = action.payload.pageSize;
    });
    builder.addCase(addHouseholdDevice.fulfilled, (state, action: any) => {
      // state.feedDetail.data = action.payload;
    });
    builder.addCase(addAreaDevice.fulfilled, (state, action: any) => {
      // state.feedDetail.data = action.payload;
    });
    builder.addCase(getDeviceTopics.fulfilled, (state, action: any) => {
      const sortedTopic = action.payload.topics.sort((a: any, b: any) => a.number_of_devices > b.number_of_devices ? -1 : 1);
      state.topics = sortedTopic;
    });
    builder.addCase(getDeviceByTopic.fulfilled, (state, action: any) => {
      state.data = action.payload.devices;
    });
    builder.addCase(getDeviceDetail.fulfilled, (state, action: any) => {
      state.detail = action.payload.detail;
    });
    builder.addCase(removeDevice.fulfilled, (state, action: any) => {
      state.data = state.data.filter((item: any) => item.device_id !== action.payload.deviceId);
      state.topics = state.topics.map((item: any) => {
        if(item.topic === action.payload.topic) {
          item.number_of_devices -= 1;
        }
        return item;
      } );
    });
  },
}); 

export const { 
  setData,
  setPagination,
  setSearchText,
  setFilter,
  resetSearchText,
  setTab,
  addSelectedDevice,
  removeSelectedDevice,
  setSelectedDevices,
  addLogs,
  clearLogs,
  setLogs
} = deviceSlice.actions;

export default deviceSlice.reducer;
