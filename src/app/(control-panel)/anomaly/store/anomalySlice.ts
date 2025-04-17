import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import anomalyService from "@/services/anomaly/anomalyService"
import _ from "lodash";

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


export const searchAnomalyDetail = createAsyncThunk<any, any>(
  "anomaly/detail",
  async (params: { deviceId : string , timestamp: string }, { getState }: any) => {
    const data = getState()?.anomaly?.anomalySlice.data;

    try {
      const response = (await anomalyService.searchAnomalyDetail({data, ...params})) as any;
      const detail = response || {};

      return detail;
    } catch (err) {
      console.log(err);
    }
  }
);

interface anomalySliceState {
  data: [];
  detail: null,
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

const initialState: anomalySliceState = {
  data: [],
  detail: null,
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

const anomalySlice = createSlice({
  name: "anomalySlice",
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
    builder.addCase(searchAnomaly.fulfilled, (state, action: any) => {
      state.data = action.payload.data.map((item: any) => {
        if(!item?.deviceId) {
          return {
            ...item,
            deviceId: item.areaId,
          }
        } else return item
      });
    });

    builder.addCase(searchAnomalyDetail.fulfilled, (state, action: any) => {
      state.detail = action.payload;
    });
  },
}); 

export const { 
  setData,
  setPagination,
  setSearchText, 
  setFilter,
  resetSearchText
} = anomalySlice.actions;
 
export default anomalySlice.reducer;
