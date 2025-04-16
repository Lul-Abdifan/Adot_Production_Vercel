import { FC } from "react";
import CountUp from "react-countup";
import { PiUsersThree } from "react-icons/pi";

interface CardProps {
    title: string;
    count: number;
}

const TotalNumberOf: FC<CardProps> = ({ title, count }) => {
    return (
        <div className="h-80 w-72 rounded-[20px] bg-white">
            <div className="flex mx-auto rounded-full w-fit flex-row items-center">
                <div className="mt-12">
                    <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
                        <span className="flex items-center text-white">
                            <PiUsersThree className="h-12 w-12 mt12 text-primary" />
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-gray-500 w-fit mx-auto">
                <span className="flex items-center text-xl lg:px-16 text-center font-extrabold w-fit">
                    {title}
                </span>
            </div>
            <div className="mt-8 text-primary w-fit mx-auto">
                <span className="flex items-center text-4xl text-center font-extrabold w-fit">
                    <CountUp start={0} end={count} duration={2.5} delay={0} />
                </span>
            </div>
        </div>
    );
};

export default TotalNumberOf;
