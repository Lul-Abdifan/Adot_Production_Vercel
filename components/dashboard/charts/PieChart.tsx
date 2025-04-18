"use client";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const PieChart = (props: { chartData: any; chartOptions: any }) => {
    const { chartData, chartOptions } = props;

    return (
        <Chart
            options={chartOptions}
            type="pie"
            width="100%"
            height="100%"
            series={chartData}
        />
    );
};

export default PieChart;
