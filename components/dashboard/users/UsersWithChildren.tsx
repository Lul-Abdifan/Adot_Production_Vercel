import PieChart from "../charts/PieChart";
import { useGetUsersChildrenQuery } from "@/api/dashboard-api";
import { useEffect, useState } from "react";

const UsersWithChildren = () => {
    const { data, isSuccess } = useGetUsersChildrenQuery();

    useEffect(() => {
        if (isSuccess) {
            setPieChart(Object.values(data.data));
        }
    }, [isSuccess, data?.data]);

    const [pieChartData, setPieChart] = useState<number[]>([0, 0, 0, 0]);

    const pieChartOptions = {
        chart: {
            width: "100%",
            type: "pie",
        },
        tooltip: {
            style: {
                fontSize: "12px",
                fontFamily: undefined,
                backgroundColor: "#000000",
            },
            onDatasetHover: {
                style: {
                    fontSize: "12px",
                    fontFamily: undefined,
                },
            },
            theme: "dark",
        },
        theme: {
            monochrome: {
                enabled: true,
                color: "#AE709F",
                shadeTo: "light",
                shadeIntensity: 0.65,
            },
        },
        labels: ["0", "1", "2", "3+"],
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: -5,
                },
            },
        },

        dataLabels: {
            show: false,

            formatter(val: any, opts: any) {
                const name = opts.w.globals.labels[opts.seriesIndex];
                return [name, val.toFixed(1) + "%"];
            },
        },

        legend: {
            position: "right",
            offsetY: 0,
            offsetX: 24,
            height: 230,
        },
    };

    return (
        <div
            className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-100 dark:shadow-none dark:!bg-navy-800 dark:text-white  pb-7 p-[20px]`}
        >
            <div className="w-full">
                <div className="flex flex-col items-start">
                    <p className="mt-2 text-sm text-gray-600">
                        Count of Users With Children
                    </p>
                </div>
            </div>

            <div className="h-[250px] w-full pt-10 pb-0">
                <PieChart
                    chartOptions={pieChartOptions}
                    chartData={pieChartData}
                />
            </div>
        </div>
    );
};

export default UsersWithChildren;
