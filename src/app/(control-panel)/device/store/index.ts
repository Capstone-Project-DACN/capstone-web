import { combineReducers } from "@reduxjs/toolkit";
import deviceSlice from "./deviceSlice";

const reducer = combineReducers({
  deviceStore: deviceSlice,
});

export default reducer;
