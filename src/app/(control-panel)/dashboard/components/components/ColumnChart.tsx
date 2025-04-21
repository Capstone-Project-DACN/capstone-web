import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";

const HCMC_Districts = [
  "Q1", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q10", 
  // "Q11", "Q12", "QTB", "QBTHANH", "QGV", "QPN", "QTP", "Q2", "Q9",
]

const districtDisplayNames = {
  "Q1": "Quận 1", 
  "Q3": "Quận 3",
  "Q4": "Quận 4",
  "Q5": "Quận 5",
  "Q6": "Quận 6",
  "Q7": "Quận 7",
  "Q8": "Quận 8",
  "Q10": "Quận 10",
  "Q11": "Quận 11",
  "Q12": "Quận 12",
  "QTB": "Tân Bình",
  "QBTHANH": "Bình Thạnh",
  "QGV": "Gò Vấp",
  "QPN": "Phú Nhuận",
  "QTP": "Tân Phú",
  "Q2": "Quận 2",
  "Q9": "Quận 9"
}
const ColumnChart = ({loading = false}) => {
  const cityData = useSelector((state: any) => state?.dashboard?.dashboardSlice?.cityData) || [];
  
  const cityDataMap = {};
  cityData.forEach((item) => {
    cityDataMap[item.name] = item;
  });
  
  const fullDistrictData = HCMC_Districts.map((districtCode) => {
    const districtData = cityDataMap[districtCode];
    
    return {
      name: districtDisplayNames[districtCode] || districtCode,
      value: districtData ? Math.abs(districtData.value) : 0
    };
  });

  console.log({ fullDistrictData });

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 450,
      toolbar: { show: false },
    },
    xaxis: {
      categories: fullDistrictData.map((d) => d.name),
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
      data: fullDistrictData.map((d: any) => d.value),
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
