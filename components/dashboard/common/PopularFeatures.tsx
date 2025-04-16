import { useGetPopularFeaturesQuery } from "@/api/dashboard-api";
import { getNextSaturday, getPreviousSunday } from "@/utils/date-format";
import { useState } from "react";
import { DatePickerWithRange } from "./DatePickerRange";

const PopularFeatures = () => {
    const today = new Date();
    const [startDate, setstartdate] = useState<string>(
        getPreviousSunday(today)
    );
    const [endDate, setenddate] = useState<string>(getNextSaturday(today));
    const { data, isLoading, isSuccess } = useGetPopularFeaturesQuery({
        startDate,
        endDate,
    });
    let features: Feature[] = [];
    if (isSuccess) {
        features = data?.data;
    }

    return (
        <div
            className={`!z-5 relative flex flex-col overflow-auto text-sm rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-100 dark:shadow-none dark:!bg-navy-800 dark:text-white  pb-7 p-[20px]`}
        >
            <div className="w-full flex justify-between">
                <div className="flex flex-col items-start">
                    <p className="mt-2 px-2 text-gray-600 text-md font-medium">
                        Popular Features
                    </p>
                </div>
                <DatePickerWithRange
                    setstartdate={setstartdate}
                    setenddate={setenddate}
                />
            </div>

            <div className="xl:block hidden h-[300px] w-full pt-5 pb-0 px-2 font-medium text-gray-400">
                <div className="mt-0.5 flex justify-between w-full">
                    <span className="w-[180px]">Features</span>
                    <span className="w-32">Popularity Level</span>
                    <span className="w-28">Average DAU</span>
                </div>

                <div className="w-full text-secondary font-light pt-2">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="flex justify-between w-full my-5 items-center"
                        >
                            <span className="w-[180px]">
                                {feature.featureName}
                            </span>

                            <div className="flex w-32 gap-4 items-center px-3">
                                <div
                                    className={`w-full ${
                                        feature.popularity < 30
                                            ? "bg-[#FBDCD5]"
                                            : feature.popularity < 70
                                            ? "bg-[#FBF0E4]"
                                            : "bg-[#DEF5EB]"
                                    } rounded-full h-1.5 dark:bg-gray-700`}
                                >
                                    <div
                                        className={`h-1.5 rounded-full ${
                                            feature.popularity < 30
                                                ? "bg-archive"
                                                : feature.popularity < 70
                                                ? "bg-warning"
                                                : "bg-success"
                                        }`}
                                        style={{
                                            width: `${feature.popularity}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <span className="w-28 text-center px-3">
                                {feature.numberOfUniqueUsers}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-[300px] xl:hidden w-full pt-5 pb-0 px-2 font-medium text-gray-400">
                <div className="mt-0.5 flex justify-between w-full">
                    <span>Features</span>
                    <span>Users Interaction</span>
                </div>

                <div className="block w-full text-secondary font-light pt-2">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="flex justify-between w-full my-5 items-center gap-2"
                        >
                            <span className="w-[180px]">
                                {feature.featureName}
                            </span>
                            <div className="flex w-28 gap-4 items-center px-3">
                                <div
                                    className={`w-full ${
                                        feature.popularity < 30
                                            ? "bg-[#FBDCD5]"
                                            : feature.popularity < 70
                                            ? "bg-[#FBF0E4]"
                                            : "bg-[#DEF5EB]"
                                    } rounded-full h-1.5 dark:bg-gray-700`}
                                >
                                    <div
                                        className={`h-1.5 rounded-full ${
                                            feature.popularity < 30
                                                ? "bg-archive"
                                                : feature.popularity < 70
                                                ? "bg-warning"
                                                : "bg-success"
                                        }`}
                                        style={{
                                            width: `${feature.popularity}%`,
                                        }}
                                    ></div>
                                </div>
                                {feature.numberOfUniqueUsers}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularFeatures;
