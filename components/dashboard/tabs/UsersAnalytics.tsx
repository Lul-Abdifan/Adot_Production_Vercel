import NewAddedUsers from "../users/NewRegisteredUsers";
import DailyActiveUsers from "../users/DailyActiveUsers";
import PopularFeatures from "../common/PopularFeatures";
import UserAgeDistribution from "../users/UserAgeDistribution";
import UsersWithChildren from "../users/UsersWithChildren";
import { useGetAllTotalCountsQuery } from "@/api/dashboard-api";
import TotalNumberOf from "../common/TotalNumberOf";

const UsersAnalytics = () => {
    const { data } = useGetAllTotalCountsQuery();
    return (
        <div className="">
            <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-4">
                    <TotalNumberOf
                        title={"Total Number of Users"}
                        count={data?.data.usersCount || 0}
                    />
                </div>
                <div className="col-span-8">
                    <NewAddedUsers chartHeight="h-52" />
                </div>
                <div className="col-span-7">
                    <UserAgeDistribution />
                </div>
                <div className="col-span-5">
                    <UsersWithChildren />
                </div>
                <div className="col-span-12">
                    <DailyActiveUsers style={"px-10"} />
                </div>
                <div className="col-span-12">
                    <PopularFeatures />
                </div>
            </div>
        </div>
    );
};

export default UsersAnalytics;
