import BarChart from "../charts/BarChart";
import { useGetUsersAgeDistributionQuery } from "@/api/dashboard-api";
import { useEffect, useState } from "react";

const UserAgeDistribution = () => {
    const { data, isSuccess } = useGetUsersAgeDistributionQuery();
    const [keys, setKeys] = useState<string[]>([]);
    const [vals, setVals] = useState<number[]>([]);

    const barChartDataDailyTraffic = [
        {
            name: "Users",
            data: vals,
        },
    ];

    const barChartOptionsDailyTraffic = {
        chart: {
            toolbar: {
                show: false,
            },
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
        xaxis: {
            categories: keys,
            show: false,
            labels: {
                show: true,
                style: {
                    colors: "#AE709F",
                    fontSize: "14px",
                    fontWeight: "500",
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: false,
            color: "black",
            labels: {
                show: true,
                style: {
                    colors: "#AE709F",
                    fontSize: "14px",
                },
            },
        },
        grid: {
            show: false,
            strokeDashArray: 5,
            yaxis: {
                lines: {
                    show: true,
                },
            },
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                colorStops: [
                    [
                        {
                            offset: 0,
                            color: "#AE709F",
                            opacity: 0.9,
                        },
                        {
                            offset: 100,
                            color: "#AE709F",
                            opacity: 0.8,
                        },
                    ],
                ],
            },
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            bar: {
                borderRadius: 13,
                columnWidth: "25px",
            },
        },
    };

    useEffect(() => {
        if (isSuccess) {
            setVals(Object.values(data.data));
            setKeys(Object.keys(data.data));
        }
    }, [isSuccess, data?.data]);

    return (
        <div
            className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-100 dark:shadow-none dark:!bg-navy-800 dark:text-white  pb-7 p-[20px]`}
        >
            <div className="w-full">
                <div className="flex flex-col items-start">
                    <p className="mt-2 text-sm text-gray-600">
                        User Age Distribution
                    </p>
                </div>
            </div>

            <div className="h-[250px] w-full pt-10 pb-0">
                <BarChart
                    chartData={barChartDataDailyTraffic}
                    chartOptions={barChartOptionsDailyTraffic}
                />
            </div>
        </div>
    );
};

export default UserAgeDistribution;
