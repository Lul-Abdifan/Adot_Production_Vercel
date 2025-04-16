import React from "react";
import { useGetAllTotalCountsQuery } from "@/api/dashboard-api";
import { IoBulbOutline } from "react-icons/io5";
import TotalContentCountCard from "../common/TotalContentCountCard";
import DailyAddedTopics from "../topics/DailyAddedTopics";
import TopicsPopularityTable from "../topics/TopicsPopularityTable";

function TopicAnalytics() {
    const { data } = useGetAllTotalCountsQuery();
    return (
        <div className="">
            <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-4 flex flex-col gap-6 ">
                    <TotalContentCountCard
                        title={"Total Number of Topics"}
                        subtitle={data?.data.totalTopicCount || 0}
                        icon={
                            <IoBulbOutline className="h-6 w-6 text-primary" />
                        }
                    />
                    <TotalContentCountCard
                        title={"Total Number of Archived Topics"}
                        subtitle={data?.data.archivedTopicCount || 0}
                        icon={
                            <IoBulbOutline className="h-6 w-6 text-primary" />
                        }
                    />
                </div>
                <div className="col-span-8">
                    <DailyAddedTopics chartHeight="h-52" />
                </div>
            </div>
            <TopicsPopularityTable />
        </div>
    );
}
export default TopicAnalytics;
