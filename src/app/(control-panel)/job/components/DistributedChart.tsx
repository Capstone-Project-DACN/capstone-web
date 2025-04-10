import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import { ApexOptions } from "apexcharts";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getDistributionData, openJobDialog } from "@/dialogs/job/JobDialogSlice";
import { useSelector } from "react-redux";
import { set } from "lodash";
import { stat } from "fs";

interface DistributionChartProps {
  data: {
    chart_title: string;
    chart_data: number[];
  };
  loading?: boolean;
  height?: number;
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  data,
  loading = false,
  height = 350,
}) => {
  // Filter out zero values and keep first set of non-zero values
  const processedData = React.useMemo(() => {
    const nonZeroData = data.chart_data.filter((value) => value > 0);
    return nonZeroData;
  }, [data.chart_data]);

  // Generate appropriate number of categories (x-axis labels)
  const categories = React.useMemo(() => {
    return Array.from({ length: processedData.length }, (_, i) => `${i + 1}`);
  }, [processedData.length]);

  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      height: height,
      type: "bar",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "90%",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val: number) {
        return val.toFixed(0);
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    xaxis: {
      categories: categories,
      position: "bottom",
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: true,
        style: {
          fontSize: "10px",
        },
        formatter: function (value) {
          // Show every 5th label to avoid crowding
          const index = parseInt(value);
          return index % 5 === 0 ? value : "";
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
        formatter: function (val: number) {
          return val.toFixed(0);
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    colors: ["#2E93fA"],
    // title: {
    //   text: data.chart_title,
    //   align: "center",
    //   style: {
    //     fontSize: "16px",
    //     fontWeight: "bold",
    //     color: "#444",
    //   },
    // },
    tooltip: {
      enabled: true,
      theme: "light",
      y: {
        formatter: (val: number) => val.toFixed(0),
      },
    },
  });

  const [series, setSeries] = useState<ApexAxisChartSeries>([
    {
      name: "Frequency",
      data: processedData,
    },
  ]);

  useEffect(() => {
    // Update chart data when props change
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      title: {
        ...prevOptions.title,
        text: data.chart_title,
      },
      xaxis: {
        ...prevOptions.xaxis,
        categories: categories,
      },
    }));

    setSeries([
      {
        name: "Frequency",
        data: processedData,
      },
    ]);
  }, [data, processedData, categories]);

  return (
    <Box className="py-2 rounded-lg w-full">
      <Box className="relative">
        {loading && (
          <Box className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <CircularProgress />
          </Box>
        )}
        <Box className="mb-2">
          <Typography variant="h6" className="text-center text-gray-700">
            {data.chart_title}
          </Typography>
        </Box>
        <Box className="mt-2">
          {processedData.length > 0 ? (
            <ReactApexChart
              options={chartOptions}
              series={series}
              type="bar"
              height={height}
            />
          ) : (
            <Box
              className="flex justify-center items-center"
              style={{ height: height }}
            >
              <Typography variant="body1" color="textSecondary">
                No data available to display
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Usage example component
const DistributedChart = (props: any) => {
  const { refresh, toggleRefresh } = props;
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: any) => state?.jobs?.jobDialogSlice?.data);
  const jobDetail = useSelector((state: any) => state?.jobs?.jobSlice?.detail);
  const job_Id = new URLSearchParams(window.location.search).get("job_id");

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const job = {
        cron_type: searchParams.get("cron_type"),
        city_id: searchParams.get("city_id"),
        district_id: searchParams.get("district_id"),
      }
      if(jobDetail?.status === "running") {
        dispatch(getDistributionData({job})).then((res) => {
        })
      }
    } catch (error) {
      console.log(error)
    }
  }, [refresh, job_Id])

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const job = {
        cron_type: searchParams.get("cron_type"),
        city_id: searchParams.get("city_id"),
        district_id: searchParams.get("district_id"),
      }
      dispatch(getDistributionData({job})).then((res) => {})
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    const invtervalId = setInterval(() => {
      if(jobDetail?.status === "running") toggleRefresh((prev: boolean) => !prev);
    }, 3000)
    return () => clearInterval(invtervalId);
  })

  if(!data) return;

  return (
    <div className="overflow-y-scroll scrollbar-hide w-full">
      <DistributionChart data={data.data} />
    </div>
  );
};

export default DistributedChart;
