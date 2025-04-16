import React from "react";
import { useGetAllTotalCountsQuery } from "@/api/dashboard-api";
import { IoBulbOutline } from "react-icons/io5";
import AddedInsights from "../insights/DailyAddedInsights";
import TotalContentCountCard from "../common/TotalContentCountCard";
import InsightsPopularityTable from "../insights/InsightsPopularityTable";

function InsightAnalytics() {
    const { data } = useGetAllTotalCountsQuery();
    
    return (
        <div className="">
            <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-4 flex flex-col gap-6 ">
                    <TotalContentCountCard
                        title={"Total Number of Insights"}
                        subtitle={data?.data.totalInsightCount || 0}
                        icon={
                            <IoBulbOutline className="h-6 w-6 text-primary" />
                        }
                    />
                    <TotalContentCountCard
                        title={"Total Number of Archived Insights"}
                        subtitle={data?.data.archivedInsightCount || 0}
                        icon={
                            <IoBulbOutline className="h-6 w-6 text-primary" />
                        }
                    />
                </div>
                <div className="col-span-8">
                    <AddedInsights chartHeight="h-52" />
                </div>
            </div>
            <InsightsPopularityTable />
        </div>
    );
}
export default InsightAnalytics;
