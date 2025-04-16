import PopularFeatures from "../common/PopularFeatures";
import TotalCountOverview from "../common/TotalCountDoctor";
import DailyNewAddedDoctor from "../doctors/DailyNewAddedDoctor";
import AddedInsights from "../insights/DailyAddedInsights";
import DailyActiveUsers from "../users/DailyActiveUsers";
import DailyActiveTimeBound from "../users/DailyActiveDoctors";
import NewActiveUsers from "../users/TimeBoundRegistered";
import { useGetAllTotalCountsQuery } from "@/api/dashboard-api";
import DoctorPopularFeatures from "@/components/dashboard/doctors/DoctorPopularFeatures"
const DoctorAnalytics = () => {
  const { data } = useGetAllTotalCountsQuery();
  return (
   <div className="">
            <TotalCountOverview  />
            <div className="grid grid-cols-2 gap-4 mt-4">
              
                <NewActiveUsers chartHeight="h-[250px]" />
                <DailyActiveTimeBound chartHeight="h-[250px]" />
                <DailyNewAddedDoctor chartHeight="h-[270px]"  />
                 <DoctorPopularFeatures/> 
            </div>
           
        </div>
  );
};

export default DoctorAnalytics;
