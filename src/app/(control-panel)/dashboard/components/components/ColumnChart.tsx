import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardContent, Typography } from '@mui/material';

interface DistrictData {
  name: string;
  value: number;
}

const districts: DistrictData[] = [
  { name: 'Quận 1', value: 120 },
  { name: 'Quận 2', value: 140 },
  { name: 'Quận 3', value: 110 },
  { name: 'Quận 4', value: 90 },
  { name: 'Quận 5', value: 130 },
  { name: 'Quận 6', value: 85 },
  { name: 'Quận 7', value: 150 },
  { name: 'Quận 8', value: 95 },
  { name: 'Quận 9', value: 170 },
  { name: 'Quận 10', value: 100 },
  { name: 'Quận 11', value: 105 },
  { name: 'Quận 12', value: 160 },
  { name: 'Bình Thạnh', value: 145 },
  { name: 'Gò Vấp', value: 135 },
  { name: 'Tân Bình', value: 125 },
  { name: 'Tân Phú', value: 115 },
  { name: 'Phú Nhuận', value: 98 },
  { name: 'Thủ Đức', value: 155 },
  { name: 'Bình Tân', value: 138 },
  { name: 'Nhà Bè', value: 88 },
  { name: 'Hóc Môn', value: 92 },
  { name: 'Củ Chi', value: 78 },
  { name: 'Bình Chánh', value: 108 },
  { name: 'Cần Giờ', value: 65 },
];

const ColumnChart: React.FC = () => {
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 450,
      toolbar: { show: false },
    },
    xaxis: {
      categories: districts.map((d) => d.name),
      labels: {
        rotate: -35,
        style: {
          fontSize: '12px',
        },
      },
    },
    // yaxis: {
    //   title: {
    //     text: 'Điện tiêu thụ (kWh)',
    //   },
    // },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} kWh`,
      },
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        columnWidth: '60%',
      },
    },
    colors: ['#3b82f6'],
  };

  const chartSeries = [
    {
      name: 'Điện tiêu thụ',
      data: districts.map((d) => d.value),
    },
  ];

  return (
    <Card className="shadow-none rounded-6 p-4">
      <CardContent>
        <div id="chart">
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={450}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ColumnChart;
