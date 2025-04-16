import NewActiveUsers from "../users/NewRegisteredUsers";
import DailyActiveUsers from "../users/DailyActiveUsers";
import AddedInsights from "../insights/DailyAddedInsights";
import PopularFeatures from "../common/PopularFeatures";
import TotalCountOverview from "../common/TotalCountOverview";

const Overview = () => {
    return (
        <div className="">
            <TotalCountOverview />
            <div className="grid grid-cols-2 gap-4 mt-4">
                <NewActiveUsers chartHeight="h-[250px]" />
                <DailyActiveUsers />
                <AddedInsights chartHeight="h-[250px]" />
                <PopularFeatures />
            </div>
        </div>
    );
};

export default Overview;
