import LineChart from "../charts/LineChart";
import { DatePickerWithRange } from "../common/DatePickerRange";
import { useGetDailyRegisteredUsersQuery } from "@/api/dashboard-api";
import { useGetDailyRegisteredDoctors4TimeQuery } from "@/api/doctor-api";
import {
  formatDateShortYear,
  getNextSaturday,
  getPreviousSunday,
} from "@/utils/date-format";
import { FC, useEffect, useState } from "react";

interface ChartProps {
  chartHeight?: string;
}

const DailyNewAddedDoctor: FC<ChartProps> = ({ chartHeight }) => {
  const today = new Date();
  const [startDate, setStartDate] = useState<string>(getPreviousSunday(today));
  const [endDate, setEndDate] = useState<string>(getNextSaturday(today));

  const [registeredDoctor, setRegisteredDoctor] = useState([]);

  const {
    data: dailyRegisteredDoctor,
    isSuccess: dailyRegisteredDoctorSuccess,
    isLoading,
  } = useGetDailyRegisteredDoctors4TimeQuery({ date: startDate });

  useEffect(() => {
    if (dailyRegisteredDoctorSuccess && !isLoading) {
      setRegisteredDoctor(dailyRegisteredDoctor?.data || []);
    }
  }, [dailyRegisteredDoctorSuccess, isLoading, dailyRegisteredDoctor]);

  console.log(Object.values(registeredDoctor))

  const registeredDoctorValues = [0,...Object.values(registeredDoctor)]
  const registeredDoctorValTotal = registeredDoctorValues.reduce(
    (acc, value) => acc + value,
    0
  );
  const lineChartDataTotalSpent = [
    {
      name: "Doctors",
      data: registeredDoctorValues, // Example data for chart
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
        backgroundColor: "#000000",
      },
      x: {
        formatter: (val: number) => `Hour: ${val}`,
      },
      y: {
        formatter: (val: number) => `Count: ${val}`,
      },
      theme: "dark",
    },
    grid: {
      show: true,
      borderColor: "#f0cee8",
    },
    xaxis: {
      categories: [0,6, 12, 18, 24], // Custom x-axis categories
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
        },
        formatter: (val: string | number) => String(val), // Ensure consistent string output
      },
    },

    yaxis: {
      show: true,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
        },
        formatter: (val: number) => val.toString(),
      },
    },
  };

  return (
    <div
      className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl dark:!bg-navy-800 dark:text-white !p-[20px] text-center`}
    >
      <div className="h-full w-full sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="flex">
          <div className="w-full">
            <p className="text-xl font-bold text-left text-gray-700">{registeredDoctorValTotal || 0}</p>
            <div className="flex flex-col items-start">
              <p className="mt-2 text-sm text-gray-600">
                Daily New Registered Doctors
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

export default DailyNewAddedDoctor;

// import LineChart from "../charts/LineChart";
// import { DatePickerWithRange } from "../common/DatePickerRange";
// import PercentageIndicator from "../common/PercentageIndicator";
// import { useGetDailyRegisteredUsersQuery } from "@/api/dashboard-api";
// import { useGetDailyRegisteredDoctorsQuery } from "@/api/dashboard-api";
// import { useGetDailyRegisteredDoctors4TimeQuery } from "@/api/doctor-api";
// import {
//   formatDateShortYear,
//   getNextSaturday,
//   getPreviousSunday,
// } from "@/utils/date-format";
// import { FC, useState } from "react";

// interface ChartProps {
//   chartHeight?: string;
// }

// const DailyNewAddedDoctor: FC<ChartProps> = ({ chartHeight }) => {
//   const today = new Date();

//   const [startDate, setStartDate] = useState<string>(getPreviousSunday(today));
//   const [endDate, setEndDate] = useState<string>(getNextSaturday(today));
//   const { data, isSuccess } = useGetDailyRegisteredUsersQuery({
//     startDate,
//     endDate,
//   });

//   const {
//     data: dailyRegisteredDoctor,
//     isSuccess: dailyRegisteredDoctorSuccess,
//   } = useGetDailyRegisteredDoctors4TimeQuery({ date: startDate });
//   console.log(dailyRegisteredDoctor);

//   const lineChartDataTotalSpent = [
//     {
//       name: "Doctors",
//       data: [] as number[],
//       color: "#AE709F",
//     },
//   ];

//   const lineChartOptionsTotalSpent = {
//     legend: {
//       show: false,
//     },

//     chart: {
//       type: "line",
//       toolbar: {
//         show: false,
//       },
//     },

//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       curve: "smooth",
//     },

//     tooltip: {
//       style: {
//         fontSize: "12px",
//         fontFamily: undefined,
//         backgroundColor: "#000000",
//       },
//       x: {
//         formatter: (val: number) => {
//           const date = new Date(val);
//           return date.toLocaleDateString();
//         },
//       },
//       y: {
//         formatter: (val: number) => String(val),
//       },
//       theme: "dark",
//     },

//     grid: {
//       show: true,
//       borderColor: "#f0cee8",
//       strokeDashArray: 0,
//       xaxis: {
//         categories: [0, 6, 12, 18], // Custom x-axis categories

//         lines: {
//           show: false,
//         },
//       },
//       yaxis: {
//         lines: {
//           show: true,
//           strokeWidth: 1,
//         },
//       },
//     },
//     xaxis: {
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//       labels: {
//         style: {
//           colors: "#A3AED0",
//           fontSize: "12px",
//           fontWeight: "500",
//         },
//         formatter: (val: string) => {
//           const date = new Date(parseInt(val));
//           return date.getDate().toString();
//         },
//       },
//       tickAmount: 4,
//       type: "datetime",
//       categories: [] as number[],
//     },

//     yaxis: {
//       show: true,
//       labels: {
//         style: {
//           colors: "#A3AED0",
//           fontSize: "12px",
//           fontWeight: "500",
//         },
//         formatter: (val: number) => Math.round(val).toString(),
//       },
//     },
//   };

//   if (isSuccess && dailyRegisteredDoctorSuccess) {
//     const idArray: number[] = data?.data?.registeredUsersStats.map(
//       (item: StatsItem) => new Date(item._id).getTime()
//     );
//     console.log(idArray);
//     const valuesXValues = Object.values(dailyRegisteredDoctor?.data); // [0, 0, 0, 0]
//     console.log(valuesXValues)

//     const countArray: number[] = data?.data?.registeredUsersStats.map(
//       (item: StatsItem) => item.count
//     );

//     //     const dailyDoctorKeys= Object.values(dailyRegisteredDoctor?.data)
//     const dailyDoctors = dailyRegisteredDoctor;
//     console.log(dailyRegisteredDoctor?.data);

//     const keys = Object.keys(dailyRegisteredDoctor?.data); // ['0-6', '6-12', '12-18', '18-24']
//     // const values = Object.values(dailyRegisteredDoctor?.data); // [0, 0, 0, 0]
//     console.log("Keys:", keys);
//     console.log("Values:", valuesXValues);
//     //     const dailyDoctorKeys = Object.keys(dailyDoctors);
//     //     console.log([dailyDoctorKeys]);
//     lineChartDataTotalSpent[0].data = [10,5,10,8];
//     console.log(countArray);
//     lineChartOptionsTotalSpent.xaxis.categories = [0, 6, 12, 18];
//     // lineChartOptionsTotalSpent.xaxis.tickAmount =

//   }

//   return (
//     <div
//       className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl dark:!bg-navy-800 dark:text-white !p-[20px] text-center`}
//     >
//       <div className="h-full w-full sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
//         <div className="flex">
//           <div className="w-full">
//             <p className="text-xl font-bold text-left text-gray-700">
//               {data?.data.totalRegisteredUsersAdded}
//             </p>
//             <div className="flex flex-col items-start">
//               <p className="mt-2 text-sm text-gray-600">
//                 Daily New Registered Doctors
//               </p>
//             </div>
//           </div>
//           <DatePickerWithRange
//             setstartdate={setStartDate}
//             setenddate={setEndDate}
//           />
//         </div>
//         <div className={`${chartHeight} w-full`}>
//           <LineChart
//             chartOptions={lineChartOptionsTotalSpent}
//             chartData={lineChartDataTotalSpent}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DailyNewAddedDoctor;
