import { Category } from "@/types/category";
import React, { FC } from "react";

interface CategoryTileProps {
    category: Category;
    idx: number;
}

export const CategoryTile: FC<CategoryTileProps> = ({ category, idx }) => {
    return (
        <tr key={category._id} className="odd:bg-bgTile ">
            <td className="whitespace-nowrap px-6 py-4 text-xs text-title ">
                {category.rank}
            </td>
            <td className="whitespace-nowrap px-3 pr-4 sm:pr-16 py-4 text-xs text-title">
                {category.versions[0].title}
                <div className="mt-2"> እርግዝና ትሪሚስተር</div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-xs text-subtitle">
                <div className="flex items-center">
                    <div className="rounded-full border border-solid p-2 mr-2 flex items-center">
                        <span className="sm:mr-6">{`Covers ${category.topics.length} Topics`}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 ml-1"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                <div className="mb-2">Dec 12, 2024</div>
                <div>10:49AM</div>
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 sm:ml-4">
                <div className="flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        color="#AE709F"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 mx-2 rounded-full bg-[#AE709F] bg-opacity-20 p-2"
                    >
                        <path
                            strokeLinecap="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                    </svg>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        color="#FF3B30"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 mx-2 rounded-full bg-[#FF3B30] bg-opacity-20 p-2"
                    >
                        <path
                            strokeLinecap="round"
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                        />
                    </svg>
                </div>
            </td>
        </tr>
    );
};

export default CategoryTile;
