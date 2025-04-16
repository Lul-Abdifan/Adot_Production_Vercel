import LineChart from "../charts/LineChart";
import { DatePickerWithRange } from "../common/DatePickerRange";
import PercentageIndicator from "../common/PercentageIndicator";
import { useGetDailyActiveUsersQuery } from "@/api/dashboard-api";
import {
  formatDateShortYear,
  getNextSaturday,
  getPreviousSunday,
} from "@/utils/date-format";
import { FC, useState } from "react";

interface ChartProps {
  style?: string;
}

const DailyActiveUsers: FC<ChartProps> = ({ style }) => {
  const today = new Date();

  const [startDate, setstartdate] = useState<string>(getPreviousSunday(today));
  const [endDate, setenddate] = useState<string>(getNextSaturday(today));
  const { data, isSuccess } = useGetDailyActiveUsersQuery({
    startDate,
    endDate,
  });

  const lineChartDataTotalSpent = [
    {
      name: "Users",
      data: [] as number[],
      color: "#AE709F",
    },
  ];

  const lineChartOptionsTotalSpent = {
    legend: {
      show: false,
    },

    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },

    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgroundColor: "#000000",
      },
      x: {
        formatter: (val: string, opts: any) => {
        
          const date = new Date(val);
          return date.toLocaleDateString();
        },
      },
      y: {
        formatter: (val: number) => String(val),
      },
      theme: "dark",
    },

    grid: {
      show: true,
      borderColor: "#f0cee8",
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
          strokeWidth: 1,
        },
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
        formatter: (val: string) => {
        
          const date = new Date(val);
          return date.getDate().toString();
        },
      },
      tickAmount: 8,
      type: "datetime", 
      categories: [] as string[], 
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
  };

  if (isSuccess) {
    const idArray: string[] = data?.data?.activeUsersStats.map((item) => {
      const date = new Date(item._id);
      return date.toISOString(); 
    });

    const countArray: number[] = data?.data?.activeUsersStats.map(
      (item) => item.count
    );

    lineChartDataTotalSpent[0].data = countArray;
    lineChartOptionsTotalSpent.xaxis.categories = idArray;

    console.log("idArray:", idArray); 
  }

  return (
    <div
      className={`!z-5 ${style} relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl dark:!bg-navy-800 dark:text-white !p-[20px] text-center`}
    >
      <div className="h-full w-full sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="flex">
          <div className={`w-full ${style}`}>
            <p className="text-xl font-bold text-left text-gray-700">
              {data?.data.totalActiveUsersAdded}
            </p>
            <div className="flex flex-col items-start">
              <p className="mt-2 text-sm text-gray-600">Daily Active Users</p>
              <PercentageIndicator
                percentage={data?.data.percentageGrowth || 0}
              />
            </div>
          </div>
          <DatePickerWithRange
            setstartdate={setstartdate}
            setenddate={setenddate}
          />
        </div>
        <div className={`${style} h-[250px] w-full`}>
          <LineChart
            chartOptions={lineChartOptionsTotalSpent}
            chartData={lineChartDataTotalSpent}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyActiveUsers;
