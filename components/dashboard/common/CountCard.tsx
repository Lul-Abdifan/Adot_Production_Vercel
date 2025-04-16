import React, { FC } from "react";

interface CountCardProps {
    icon: JSX.Element;
    title: string;
    subtitle: string;
}
const CountCard: FC<CountCardProps> = ({ icon, title, subtitle }) => {
    return (
        <div
            className={`!z-5 relative flex flex-col rounded-[20px] bg-white h-28 bg-clip-border shadow-3xl shadow-shadow-500 dark:shadow-none"
            }  dark:!bg-navy-800 dark:text-white !flex-row flex-grow items-center rounded-[20px]`}
        >
            <div className="ml-[18px] bg-lightPrimary flex rounded-full w-auto flex-row items-center">
                <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
                    <span className="flex items-center text-white">{icon}</span>
                </div>
            </div>

            <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                <h4 className="text-3xl font-extrabold text-navy-700">
                    {subtitle}
                </h4>
                <p className="font-dm text-xs font-normal mt-2 text-gray-400">
                    {title}
                </p>
            </div>
        </div>
    );
};

export default CountCard;
