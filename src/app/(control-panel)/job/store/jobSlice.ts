import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jobService from "@/services/job/jobService"
import { stat } from "fs";
import { get } from "lodash";

export const getCronJobs = createAsyncThunk<any, any>(
  "cronjob/getAll",
  async (params: any, { getState }: any) => {
    try {
      const response = (await jobService.getCronJobs(params)) as any;

      return {data: response?.data , total: response?.total};
    } catch (err) {
      console.log(err);
    }
  }
);

export const updateJobStatus = createAsyncThunk<any, any>(
  "cronjob/updateStatus",
  async (params: {id : number, status: string}, { getState }: any) => {
    try {
      const response = (await jobService.updateJobStatus(params)) as any;
      
      return {id: response?.id , status: response?.status};
    } catch (err) {
      console.log(err);
    }
  }
);

export const getJobDetail = createAsyncThunk<any, any>(
  "cronjob/getJobDetail",
  async (params: {id : any}, { getState }: any) => {
    try {
      const response = (await jobService.getJobDetail(params)) as any;
      
      return {id: response?.id, data: response.data};
    } catch (err) {
      console.log(err);
    }
  }
);

export interface jobSliceProps {
  data: [],
  total: number,
  loading: boolean,
  detail: any,
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

const initialState: jobSliceProps = {
  data: [],
  loading: false,
  detail: null,
  total: 0,
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

const jobSlice = createSlice({
  name: "jobSlice",
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCronJobs.fulfilled, (state, action: any) => {
      state.data = action.payload.data;
      state.total = action.payload.total;
    });
    builder.addCase(getJobDetail.fulfilled, (state, action: any) => {
      const jobDetail: any = state.data.filter((item: any) => item.id == action.payload.id)[0];
      state.detail = {...action.payload.data, ...jobDetail};
    });
    builder.addCase(updateJobStatus.fulfilled, (state, action: any) => {
      const newData: any = state.data.map((item: any) => {
        if (item.id == action.payload.id) {
            return {
            ...item,
            status: action.payload.status,
            };
        }
        return item;
    })
      if(state?.detail?.id == action.payload.id) {
        state.detail.status = action.payload.status
      }
      state.data = newData;
    })
  },
}); 

export const { 
  setData
} = jobSlice.actions;

export default jobSlice.reducer;
