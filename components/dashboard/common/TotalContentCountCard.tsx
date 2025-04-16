import React, { FC } from "react";
import CountUp from "react-countup";
interface TotalContentCountCardProps {
  icon: any;
  title: string;
  subtitle: number;
}

export const TotalContentCountCard: FC<TotalContentCountCardProps> = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <div
      className={`!z-5 relative flex flex-col rounded-[20px] bg-white h-36 bg-clip-border shadow-3xl shadow-shadow-500 dark:shadow-none"
            }  dark:!bg-navy-800 dark:text-white !flex-row flex-grow items-center rounded-[20px] border-1 border-gray-200`}
    >
      <div className="ml-6 bg-lightPrimary flex rounded-full w-auto flex-row items-center">
        <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
          <span className="flex items-center text-black">{icon}</span>
        </div>
      </div>

      <div className="h-50 ml-4 md:mr-4  flex w-auto flex-col justify-center">
        <p className="font-dm text-lg font-medium mt-2 text-[#B2B2B2] break-words">
          {title}
        </p>
        <h4 className="text-2xl font-extrabold text-black">
          <CountUp start={0} end={subtitle || 0} duration={2.5} delay={0} />
        </h4>
      </div>
    </div>
  );
};

export default TotalContentCountCard;
