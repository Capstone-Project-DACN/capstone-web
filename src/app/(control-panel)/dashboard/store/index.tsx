import { combineReducers } from "@reduxjs/toolkit";
import jobSlice from "./jobSlice";
import jobDialogSlice from "@/dialogs/job/JobDialogSlice";

const reducer = combineReducers({
  jobSlice,
  jobDialogSlice
});

export default reducer;
