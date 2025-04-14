import React from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Paper from "@mui/material/Paper";
import { Typography, useTheme } from "@mui/material";
import { formatNumber } from "@/utils/helper";

interface StatsWidgetProps {
  title: string;
  value: number | string | Date;
  trend: {
    value: number;
    direction: "up" | "down";
  };
  type?: "default" | "primary" | "success" | "danger" | "warning";
  showRangeSelector?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  perDay?: boolean;
  secondValue?: number | string | Date;
}

const StatsWidget = ({
  title,
  value,
  trend,
  type = "default",
  valuePrefix = "",
  valueSuffix = "",
  perDay = false,
  secondValue = null,
}: StatsWidgetProps) => {
  const theme = useTheme();
  const colorMap = {
    default: {
      title: "text-gray-700",
      value: "text-gray-700",
      trend: trend.direction === "up" ? "text-red-600" : "text-green-600",
    },
    primary: {
      title: "text-blue-700",
      value: "text-blue-700",
      trend: trend.direction === "up" ? "text-green-600" : "text-red-600",
    },
    success: {
      title: "text-green-700",
      value: "text-green-700",
      trend: trend.direction === "up" ? "text-green-600" : "text-red-600",
    },
    danger: {
      title: "text-red-700",
      value: "text-red-700",
      trend: trend.direction === "up" ? "text-red-600" : "text-green-600",
    },
    warning: {
      title: "text-orange-700",
      value: "text-orange-700",
      trend: trend.direction === "up" ? "text-green-600" : "text-red-600",
    },
  };

  return (
    <Paper
      className="flex  flex-col flex-auto overflow-hidden shadow rounded-md"
    >
      <div className="my-6 mt-5 text-center flex flex-col px-3 gap-y-3">
        <div className="flex justify-between items-center">
          <Typography
            className={`text-start font-semibold text-lg ${colorMap[type].title}`}
          >
            {title}
          </Typography>
        </div>

        {secondValue ? (
          <div className="flex items-center justify-center">
            <Typography
              className={`mx-auto text-center leading-none tracking-tight cursor-pointer w-fit opacity-80 hover:opacity-100 font-bold text-5xl sm:text-5xl ${colorMap[type].value} opacity-80 hover:opacity-100 transition-all cursor-pointer`}
            >
              {valuePrefix}
              {formatNumber(value)}
              {valueSuffix}
            </Typography> 
            {" - "}
            <Typography
              className={`mx-auto text-center leading-none tracking-tight cursor-pointer w-fit opacity-80 hover:opacity-100 font-bold text-5xl sm:text-5xl ${colorMap[type].value} opacity-80 hover:opacity-100 transition-all cursor-pointer`}
            >
              {valuePrefix}
              {formatNumber(secondValue)}
              {valueSuffix}
            </Typography>
          </div>
        ) : (
          <Typography
            className={`mx-auto text-center leading-none tracking-tight cursor-pointer w-fit opacity-80 hover:opacity-100 font-bold text-5xl ${colorMap[type].value} opacity-80 hover:opacity-100 transition-all cursor-pointer`}
          >
            {valuePrefix}
            {formatNumber(value)}
            {valueSuffix}
          </Typography>
        )}

        {trend.value && (
          <div className="flex items-center justify-center gap-1">
            <Typography
              component="span"
              className={`text-lg font-medium ${colorMap[type].trend}`}
            >
              {trend.direction === "up" ? "+" : "-"}
              {Math.abs(trend.value)}%
            </Typography>
            {perDay ? (
              <Typography component="span" className="font-semibold">
                /day
              </Typography>
            ) : trend.direction === "up" ? (
              <FuseSvgIcon size={20} color="action">
                heroicons-outline:arrow-trending-up
              </FuseSvgIcon>
            ) : (
              <FuseSvgIcon size={20} color="action">
                heroicons-outline:arrow-trending-down
              </FuseSvgIcon>
            )}
          </div>
        )}
      </div>
    </Paper>
  );
};

export default StatsWidget;
