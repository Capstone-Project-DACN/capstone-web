import React, { use, useEffect } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  getDailyData,
  getPredictDailyData,
  resetPredictData,
} from "../store/predict/predictSlice";
import PredictChart from "./components/PredictChart";

const PredictContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allDate = useSelector(
    (state: any) => state?.predict?.predictSlice?.allDate
  );

  useEffect(() => {
    if(!allDate || allDate.length === 1) return
    dispatch(getDailyData({}));
    // dispatch(getPredictDailyData({}));
  }, [allDate]);

  useEffect(() => {dispatch(resetPredictData())}, []);

  return (
    <>
      <Box className="w-full flex-col flex gap-10 py-10">
        <PredictChart />
      </Box>
    </>
  );
};

export default PredictContent;
