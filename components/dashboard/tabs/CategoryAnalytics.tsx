import React from "react";
import { useGetAllTotalCountsQuery } from "@/api/dashboard-api";
import TotalContentCountCard from "../common/TotalContentCountCard";
import { IoBulbOutline } from "react-icons/io5";
import DailyAddedCategories from "../category/DailyAddedCategories";
import CategoryPopularityTable from "../category/CategoriesPopularityTable";

function CategoryAnalytics() {
    const { data } = useGetAllTotalCountsQuery();
    return (
        <div className="">
            <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-4 flex flex-col gap-6 ">
                    <TotalContentCountCard
                        title={"Total Number of Categories"}
                        subtitle={data?.data.totalCategoryCount || 0}
                        icon={
                            <IoBulbOutline className="h-6 w-6 text-primary" />
                        }
                    />
                    <TotalContentCountCard
                        title={"Total Number of Archived Insights"}
                        subtitle={data?.data.archivedCategoryCount || 0}
                        icon={
                            <IoBulbOutline className="h-6 w-6 text-primary" />
                        }
                    />
                </div>
                <div className="col-span-8">
                    <DailyAddedCategories chartHeight="h-52" />
                </div>
            </div>
            <CategoryPopularityTable />
        </div>
    );
}

export default CategoryAnalytics;
