import { combineReducers } from "@reduxjs/toolkit";
import anomalySlice from "./anomalySlice";

const reducer = combineReducers({
  anomalySlice,
});

export default reducer;
