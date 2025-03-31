import { combineReducers } from "@reduxjs/toolkit";
import deviceSlice from "./deviceSlice";

const reducer = combineReducers({
  deviceSlice,
});

export default reducer;
