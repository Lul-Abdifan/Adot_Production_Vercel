import React, { FC } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { RiRectangleFill } from "react-icons/ri";

interface PercentageIndicatorProps {
    percentage: number;
}
const PercentageIndicator: FC<PercentageIndicatorProps> = ({ percentage }) => {
    return (
        <div className="flex flex-row items-center justify-center">
            {percentage > 0 ? (
                <MdArrowDropUp className="font-medium text-green-500" />
            ) : percentage < 0 ? (
                <MdArrowDropDown className="font-medium text-red-500" />
            ) : (
                <RiRectangleFill className="font-medium w-2.5 mx-1 text-orange-400" />
            )}

            <p
                className={`text-xs font-bold ${
                    percentage > 0
                        ? "text-green-500"
                        : percentage < 0
                        ? "text-red-500"
                        : "text-orange-400"
                }`}
            >
                {percentage}%{" "}
            </p>
        </div>
    );
};

export default PercentageIndicator;
