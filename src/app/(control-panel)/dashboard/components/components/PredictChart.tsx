import JobItem from "@/app/(control-panel)/job/components/JobItem";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

const PredictChart = () => {
  const allDate = useSelector((state: any) => state?.predict?.predictSlice?.allDate);
  const dailyData = useSelector((state: any) => state?.predict?.predictSlice?.dailyData);
  const predictDailyData = useSelector((state: any) => state?.predict?.predictSlice?.predictDailyData);
  const [state, setState] = useState<any>({
    series: [
      {
        name: "Current",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "Predict",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: allDate,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });

  useEffect(() => {
    const allDailyData = allDate?.map((date: string) => {
      const currentData = dailyData.find((item: any) => item.date === date);
      if (currentData) {
        return currentData.value;
      } else if (date === "2025-06-01" ) {
        return predictDailyData[0]?.value || 0;
      } else {
        return null;
      }
    }) || [];

    const allPredictDailyData = allDate?.map((date: string) => {
      const currentData = predictDailyData.find((item: any) => item.date === date);
      if (currentData) {
        return currentData.value;
      } else {
        return null;
      }
    }) || [];
    
    setState((prev: any) => {
      return {
        ...prev,
        series: [
          {
            name: "Current",
            data: allDailyData,
          },
          {
            name: "Predict",
            data: allPredictDailyData,
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "area",
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            type: "datetime",
            categories: allDate,
          },
          tooltip: {
            x: {
              format: "dd/MM/yy HH:mm",
            },
          },
        },
      }
    })
  }, [allDate, dailyData, predictDailyData])

  
  return (
    <ReactApexChart height={500} options={state.options} series={state.series} type="area" />
  );
};

export default PredictChart;
