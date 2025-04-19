import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";

interface DistrictData {
  name: string;
  value: number;
}

const districts: DistrictData[] = [
  { name: "Quận 1", value: 0 },
  { name: "Quận 3", value: 0 },
  { name: "Quận 4", value: 0 },
  { name: "Quận 5", value: 0 },
  { name: "Quận 6", value: 0 },
  { name: "Quận 7", value: 0 },
  { name: "Quận 8", value: 0 },
  { name: "Quận 0", value: 0 },
  { name: "Quận 11", value: 0 },
  { name: "Quận 12", value: 0 },
  { name: "Quận Bình Tân", value: 0 },
  { name: "Quận Bình Thạnh", value: 0 },
  { name: "Quận Gò Vấp", value: 0 },
  { name: "Quận Phú Nhuận", value: 0 },
  { name: "Quận Tân Phú", value: 0 },
  { name: "TDUC - Quận 2", value: 0 },
  { name: "TDUC - Quận 9", value: 0 },
];

const ColumnChart: React.FC = ({loading = false}) => {
  const cityData =
    useSelector((state: any) => state?.dashboard?.dashboardSlice?.cityData) ||
    districts;

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 450,
      toolbar: { show: false },
    },
    xaxis: {
      categories: districts.map((d) => d.name),
      labels: {
        rotate: -35,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return val.toFixed(2);
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} kWh`,
      },
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    colors: ["#3b82f6"],
  };

  const chartSeries = [
    {
      name: "Điện tiêu thụ",
      data: cityData.map((d: any) => d.value),
    },
  ];

 

  return (
    <Card className="shadow-none rounded-6 p-4">
      <CardContent>
        <div id="chart" className="min-h-80">
          {loading  ? <FuseLoading /> : 
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={450}
          />}
        </div>
      </CardContent>
    </Card>
  );
};

export default ColumnChart;
