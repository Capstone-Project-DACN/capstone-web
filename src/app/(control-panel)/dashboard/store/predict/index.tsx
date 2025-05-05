import { combineReducers } from "@reduxjs/toolkit";
import predictSlice from "./predictSlice";

const reducer = combineReducers({
    predictSlice,
});

export default reducer;
