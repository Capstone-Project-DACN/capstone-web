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
 
interface deviceSliceState {
  data: [];
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
      state.feedDetail.data = action.payload;
    });
    builder.addCase(addAreaDevice.fulfilled, (state, action: any) => {
      state.feedDetail.data = action.payload;
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

export const selectFeeds = ({ feeds }) => feeds.feedsManagement.data ;

export const selectSearchText = ({ feeds }) => feeds.feedsManagement.searchText;

export default deviceSlice.reducer;
