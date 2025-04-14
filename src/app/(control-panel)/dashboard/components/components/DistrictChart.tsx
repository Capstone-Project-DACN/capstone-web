import { useState } from "react";
import ReactApexChart from "react-apexcharts";

const dates = [
    { x: new Date("2024-01-01"), y: 5000000 },
    { x: new Date("2024-02-01"), y: 7000000 },
    { x: new Date("2024-03-01"), y: 6500000 },
    { x: new Date("2024-04-01"), y: 8000000 },
    { x: new Date("2024-05-01"), y: 9000000 },
    { x: new Date("2024-06-01"), y: 7500000 },
    { x: new Date("2024-07-01"), y: 7200000 },
    { x: new Date("2024-08-01"), y: 8500000 },
    { x: new Date("2024-09-01"), y: 8800000 },
    { x: new Date("2024-10-01"), y: 9300000 },
    { x: new Date("2024-11-01"), y: 9500000 },
    { x: new Date("2024-12-01"), y: 9800000 },
    { x: new Date("2025-05-01"), y: 9000000 },
    { x: new Date("2025-06-01"), y: 7500000 },
    { x: new Date("2025-07-01"), y: 7200000 },
    { x: new Date("2025-08-01"), y: 8500000 },
    { x: new Date("2025-09-01"), y: 8800000 },
  ];

const DistrictChart = () => {
    const [state, setState] = useState({
        series: [{
          name: "XYZ MOTORS",
          data: dates
        }],
        options: {
          chart: {
            type: "area" as const,
            stacked: false,
            height: 350,
            zoom: {
              type: "x" as const,
              enabled: true,
              autoScaleYaxis: true
            },
            toolbar: {
              autoSelected: "zoom" as const
            }
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0,
          },
          // title: {
          //   text: "Usage Statistics" as const,
          //   align: "left" as const
          // },
          fill: {
            type: "gradient" as const,
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 0,
              stops: [0, 90, 100]
            },
          },
          yaxis: {
            labels: {
              formatter: function (val: any) {
                return (val / 1000000).toFixed(0);
              },
            },
            title: {
              text: "Kwh" as const
            },
          },
          xaxis: {
            type: "datetime" as const,
          },
          tooltip: {
            shared: false,
            y: {
              formatter: function (val: any) {
                return (val / 1000000).toFixed(0)
              }
            }
          }
        },
    });

    return (
        <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
    );
}

export default DistrictChart;