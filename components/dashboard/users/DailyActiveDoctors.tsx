"use client";

import LineChart from "../charts/LineChart";
import { DatePickerWithRange } from "../common/DatePickerRange";
import { useGetDailyActiveRegisteredDoctorsQuery, useGetTimeBoundActiveRegisteredDoctorsQuery } from "@/api/dashboard-api";
import { getNextSaturday, getPreviousSunday } from "@/utils/date-format";
import { FC, useState, useEffect } from "react";


interface ChartProps {
  chartHeight?: string;
}

interface StatsItem {
  _id: string | number; // _id can be a string (time range) or number (timestamp)
  count: number;
}

const DailyActiveTimeBound: FC<ChartProps> = ({ chartHeight }) => {
  const today = new Date();
  const [startDate, setStartDate] = useState<string>(getPreviousSunday(today));
  const [endDate, setEndDate] = useState<string>(getNextSaturday(today));
  const [lineChartDataTotalSpent, setLineChartDataTotalSpent] = useState([
    {
      name: "Users",
      data: [] as number[],
      color: "#AE709F",
    },
  ]);

  const [lineChartOptionsTotalSpent, setLineChartOptionsTotalSpent] = useState({
    legend: { show: false },
    chart: { type: "line", toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgroundColor: "#000",
      },
      // Default tooltip formatter for datetime
      x: {
        formatter: (val: number) => new Date(val).toLocaleDateString(),
      },
      y: { formatter: (val: number) => String(val) },
      theme: "dark",
    },
    grid: {
      show: true,
      borderColor: "#f0cee8",
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true, strokeWidth: 1 } },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
        // Default formatter for datetime
        formatter: (val: string) => {
          const date = new Date(parseInt(val));
          return date.getDate().toString();
        },
      },
      tickAmount: 8,
      type: "datetime", // Default type
      categories: [] as number[],
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
        formatter: (val: number) => Math.round(val).toString(),
      },
    },
  });

  const isSingleDay = startDate === endDate;

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);
  console.log("Is Single Day:", isSingleDay);

  const { data: dailyData, isSuccess: dailyDataSuccess } =
    useGetDailyActiveRegisteredDoctorsQuery(
      { startDate },
      { skip: !isSingleDay }
    );

  const { data: timeBoundData, isSuccess: timeBoundDataSuccess } =
    useGetTimeBoundActiveRegisteredDoctorsQuery(
      { startDate, endDate },
      { skip: isSingleDay }
    );

 useEffect(() => {
   console.log("Daily Data:", dailyData);
   console.log("Time Bound Data:", timeBoundData);

 if (dailyDataSuccess) {
   const activeStats: StatsItem[] = dailyData?.data?.activeDoctorStats || [];
  
   const categories = activeStats
     .map((item) => {
       if (isSingleDay) {
         // For a single day, use the custom time interval directly
         return String(item._id).split('-')[1];
       } else {
         // For multiple dates, ensure _id is parsed as a valid date
         const dateValue = new Date(item._id);
         return isNaN(dateValue.getTime()) ? null : dateValue.getTime(); // Use timestamp
       }
     })
     .filter((item): item is number | string => item !== null); // Ensure no null values

   const counts = activeStats.map((item) => item.count);

   setLineChartDataTotalSpent([
     { name: "Users", data: counts, color: "#AE709F" },
   ]);

   setLineChartOptionsTotalSpent((prev) => ({
     ...prev,
     xaxis: {
       ...prev.xaxis,
       type: isSingleDay ? "category" : "datetime", // Use 'category' for single-day intervals
       categories: categories as number[], // Explicitly cast to number[] for datetime
       labels: {
         ...prev.xaxis.labels,
         formatter: (val: string) => {
           if (isSingleDay) {
             // For single day, display the custom time interval
             return val;
           } else {
             // For multiple dates, display the day portion of the date
             const date = new Date(parseInt(val));
             return isNaN(date.getTime())
               ? "Invalid Date"
               : date.getDate().toString();
           }
         },
       },
     },
     tooltip: {
       ...prev.tooltip,
       x: {
         formatter: (val: number | string) => {
           if (isSingleDay) {
             // Tooltip for single-day time intervals
             return val.toString();
           } else {
             // Tooltip for multiple dates
             const date = new Date(val);
             return isNaN(date.getTime())
               ? "Invalid Date"
               : date.toLocaleDateString(); // Customize tooltip format as needed
           }
         },
       },
     },
   }));
 } else if (!isSingleDay && timeBoundDataSuccess) {
   // Handle date range data with datetime categories
   const activeStats: StatsItem[] =
     timeBoundData?.data?.activeDoctorStats || [];

   const categories = activeStats.map((item) =>
     new Date(item._id as string).getTime()
   );
   const counts = activeStats.map((item) => item.count);

   setLineChartDataTotalSpent([
     { name: "Users", data: counts, color: "#AE709F" },
   ]);

   setLineChartOptionsTotalSpent((prev) => ({
     ...prev,
     xaxis: {
       ...prev.xaxis,
       type: "datetime", // Ensure type is datetime
       categories: categories,
       labels: {
         ...prev.xaxis.labels,
         formatter: (val: string) => {
           const date = new Date(parseInt(val));
           return date.getDate().toString(); // Show only the day portion
         },
       },
     },
     tooltip: {
       ...prev.tooltip,
       x: {
         formatter: (val: number) => {
           const date = new Date(val);
           return date.getDate().toString(); // Tooltip also shows only the day
         },
       },
     },
   }));
 } else {
   // Fallback: Clear chart data and categories
   setLineChartDataTotalSpent([{ name: "Users", data: [], color: "#AE709F" }]);

   setLineChartOptionsTotalSpent((prev) => ({
     ...prev,
     xaxis: {
       ...prev.xaxis,
       type: "datetime",
       categories: [],
     },
   }));
 }
 }, [
   isSingleDay,
   dailyDataSuccess,
   timeBoundDataSuccess,
   dailyData,
   timeBoundData,
   startDate,
   endDate,
 ]);




  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl dark:!bg-navy-800 dark:text-white !p-[20px] text-center">
      <div className="h-full w-full sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="w-full">
            <p className="text-xl font-bold text-left text-gray-700">
              {isSingleDay
                ? dailyData?.data?.totalActiveDoctorCount ?? 0
                : timeBoundData?.data?.totalActiveDoctorCount ?? 0}
            </p>
            <div className="flex flex-col items-start">
              <p className="mt-2 text-sm text-gray-600">
                {isSingleDay
                  ? "Active Doctors (Time Ranges)"
                  : "Time-Bound Active Doctors"}
              </p>
            </div>
          </div>
          <DatePickerWithRange
            setstartdate={setStartDate}
            setenddate={setEndDate}
          />
        </div>
        <div className={`${chartHeight} w-full`}>
          <LineChart
            chartOptions={lineChartOptionsTotalSpent}
            chartData={lineChartDataTotalSpent}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyActiveTimeBound;