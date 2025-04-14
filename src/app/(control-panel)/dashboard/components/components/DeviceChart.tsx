import { useState } from "react";
import ReactApexChart from "react-apexcharts";

const dates = [
  { x: new Date("2024-01-01"), y: 3200000 },
  { x: new Date("2024-02-01"), y: 4800000 },
  { x: new Date("2024-03-01"), y: 4500000 },
  { x: new Date("2024-04-01"), y: 5100000 },
  { x: new Date("2024-05-01"), y: 6100000 },
  { x: new Date("2024-06-01"), y: 5800000 },
  { x: new Date("2024-07-01"), y: 6200000 },
  { x: new Date("2024-08-01"), y: 6400000 },
  { x: new Date("2024-09-01"), y: 6700000 },
  { x: new Date("2024-10-01"), y: 7100000 },
  { x: new Date("2024-11-01"), y: 7400000 },
  { x: new Date("2024-12-01"), y: 7600000 },
  { x: new Date("2025-01-01"), y: 7900000 },
  { x: new Date("2025-02-01"), y: 8100000 },
  { x: new Date("2025-03-01"), y: 8300000 },
];

const DeviceChart = () => {
  const [state, setState] = useState({
    series: [
      {
        name: "Điện tiêu thụ",
        data: dates,
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
      colors: ["#22c55e"], // ✅ xanh lá cây (Tailwind green-500)
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
            return (val / 1000000).toFixed(0);
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
            return `${(val / 1000000).toFixed(0)} triệu`;
          },
        },
      },
    },
  });

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
