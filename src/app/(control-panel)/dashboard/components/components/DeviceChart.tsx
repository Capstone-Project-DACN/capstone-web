import FuseLoading from "@fuse/core/FuseLoading";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

// Dữ liệu mẫu nếu không có dữ liệu từ Redux
const dates = [
  { x: new Date("2024-01-01").getTime(), y: 0 },
  { x: new Date("2024-02-01").getTime(), y: 0 },
  { x: new Date("2024-03-01").getTime(), y: 0 },
  { x: new Date("2024-04-01").getTime(), y: 0 },
  { x: new Date("2024-05-01").getTime(), y: 0 },
  { x: new Date("2024-06-01").getTime(), y: 0 },
  { x: new Date("2024-07-01").getTime(), y: 0 },
  { x: new Date("2024-08-01").getTime(), y: 0 },
  { x: new Date("2024-09-01").getTime(), y: 0 },
  { x: new Date("2024-10-01").getTime(), y: 0 },
  { x: new Date("2024-11-01").getTime(), y: 0 },
  { x: new Date("2024-12-01").getTime(), y: 0 },
  { x: new Date("2025-01-01").getTime(), y: 0 },
  { x: new Date("2025-02-01").getTime(), y: 0 },
  { x: new Date("2025-03-01").getTime(), y: 0 },
];

const DeviceChart = ({loading = false}) => {
  const rawDeviceData = useSelector(
    (state: any) => state?.dashboard?.dashboardSlice?.deviceData
  );

  // Xử lý dữ liệu từ API để định dạng đúng cho ApexCharts
  const processData = () => {
    if (!rawDeviceData || !Array.isArray(rawDeviceData)) {
      return dates;
    }
    
    try {
      return rawDeviceData.map((item: any) => {
        // Nếu dữ liệu đã ở định dạng {x, y}
        if (item && typeof item === 'object' && 'x' in item && 'y' in item) {
          // Đảm bảo x là timestamp hoặc chuỗi ngày tháng hợp lệ
          const xValue = typeof item.x === 'string' 
            ? new Date(item.x).getTime() 
            : item.x instanceof Date 
              ? item.x.getTime() 
              : item.x;
          
          // Đảm bảo y là số
          const yValue = parseFloat(item.y);
          
          return {
            x: xValue,
            y: isNaN(yValue) ? 0 : yValue
          };
        } 

        else if (Array.isArray(item) && item.length === 2) {
          const xValue = typeof item[0] === 'string' 
            ? new Date(item[0]).getTime() 
            : item[0] instanceof Date 
              ? item[0].getTime() 
              : item[0];
          
          const yValue = parseFloat(item[1]);
          
          return {
            x: xValue,
            y: isNaN(yValue) ? 0 : yValue
          };
        }

        else if (item && typeof item === 'object') {
          let xField = item.x || item.date || item.time || "";
          let yField = item.y || item.value || item.usage || 0;
          
          const xValue = typeof xField === 'string' 
            ? new Date(xField).getTime() 
            : xField instanceof Date 
              ? xField.getTime() 
              : xField;
          
          const yValue = parseFloat(yField);
          
          return {
            x: xValue,
            y: isNaN(yValue) ? 0 : yValue
          };
        }
        
        return { x: new Date().getTime(), y: 0 };
      });
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu biểu đồ:", error);
      return dates;
    }
  };

  const processedData = processData();

  const [state, setState] = useState({
    series: [
      {
        name: "Điện tiêu thụ",
        data: processedData,
      },
    ],
    options: {
      chart: {
        type: "area" as const,
        stacked: false,
        height: 350,
        zoom: {
          type: "x" as const,
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom" as const,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      colors: ["#22c55e"], 
      fill: {
        type: "gradient" as const,
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return val.toFixed(2);
          },
        },
        title: {
          text: "Kwh",
        },
      },
      xaxis: {
        type: "datetime" as const,
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val: number) {
            return `${val.toFixed(2)} Kwh`;
          },
        },
      },
    },
  });

  // Cập nhật state khi dữ liệu thay đổi
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      series: [
        {
          ...prevState.series[0],
          data: processedData,
        },
      ],
    }));
  }, [rawDeviceData]);

  if(loading) {
    return <FuseLoading />
  }

  return (
    <ReactApexChart
      options={state.options}
      series={state.series}
      type="area"
      height={350}
    />
  );
};

export default DeviceChart;