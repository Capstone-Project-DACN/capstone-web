import { combineReducers } from "@reduxjs/toolkit";
import jobSlice from "./jobSlice";

const reducer = combineReducers({
  jobSlice,
});

export default reducer;
