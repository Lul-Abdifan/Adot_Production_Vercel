import successImg from "../../public/common/success-img.png";
import { useAddCategoryMutation, useEditCategoryMutation } from "@/api/category-api";
import { Category, CategoryFormData } from "@/types/category";
import { AddCategoryFormData, CategoryFormSchema } from "@/types/form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { number } from "zod";


interface AddCategoryDialogProps {
    setOpen: Function;
    editData?: Category;
}

export const AddCategoryDialog: FC<AddCategoryDialogProps> = ({
    setOpen,
    editData,
}) => {
    const [loading, setLoading] = useState(false);
    const [isForm, setIsForm] = useState(true);
    const [createCategory] = useAddCategoryMutation();
    const [editCategory] = useEditCategoryMutation();
    const [categoryData, setCategoryData] = useState<CategoryFormData>({
        title: "",
        rank: 1,
        titleAmh: "",
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddCategoryFormData>({
        mode: "onBlur",
        resolver: zodResolver(CategoryFormSchema),
    });

    useEffect(() => {
        if (editData !== undefined) {
            setCategoryData({
                title: editData.versions[0].title,
                titleAmh:
                    editData.versions 
                        ? editData.versions[0].title
                        : "",
                rank: editData.rank,
            });
        }
    }, [editData]);

    const registerCategory = async (e: any) => {
        setLoading(true);
        // e.preventDefault();
        const dataToSend = {
            versions: [
                {
                    language: "English",
                    title: categoryData.titleAmh,
                    desc: "Category Description",
                },
                {
                    language: "Amharic",
                    title: categoryData.title,
                    desc: "Category Description",
                },
            ],
            rank: categoryData.rank.toString(),
        };

        const res: any = editData
            ? await editCategory({ data: dataToSend, id: editData._id })
            : await createCategory({ data: dataToSend });

        if (res?.data?.statusCode == "200") {
            setIsForm(false);
            setTimeout(() => {
                setOpen(false);
            }, 2000);
        }
        setLoading(false);
    };

    return (
        <>
            <div>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-full my-6 mx-auto max-w-lg rounded-2xl">
                        <div className="rounded-2xl shadow-lg relative flex p-10 text-gray-500 flex-col w-full bg-bgTile outline-none focus:outline-none">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                }}
                                className="ml-auto -mt-4 -mr-4"
                            >
                                <IoIosCloseCircleOutline className="h-7 w-7" />
                            </button>
                            {isForm ? (
                                <form
                                    action=""
                                    onSubmit={handleSubmit(registerCategory)}
                                    className="relative flex flex-col w-full"
                                >
                                    <div className="px-6 w-full font-semibold text-xl text-primary">
                                        Add Category
                                    </div>
                                    <div className="cols-span-2 mx-6 mt-12">
                                        <label
                                            htmlFor="fullName"
                                            className="mb-2 block font-normal text-sm"
                                        >
                                            Rank
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="flex flex-col items-start">
                                            <input
                                                type="text"
                                                placeholder="Eg. 2"
                                                className={`block w-1/4 ${
                                                    errors.rank
                                                        ? "ring-1 ring-red-400"
                                                        : ""
                                                } rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 `}
                                                {...register("rank")}
                                                value={categoryData.rank}
                                                onChange={(e) => {
                                                    if (
                                                        !isNaN(
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        )
                                                    ) {
                                                        setCategoryData({
                                                            ...categoryData,
                                                            rank: parseInt(
                                                                e.target.value
                                                            ),
                                                        });
                                                    }
                                                    else{
                                                        setCategoryData({
                                                          ...categoryData,
                                                          rank: 0  
                                                          ,
                                                        }); 
                                                    }
                                                }}
                                            />
                                        </div>
                                        {errors.rank && (
                                            <span className="text-xs text-red-400 ml-2 mt-1">
                                                {errors.rank.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="cols-span-2 mx-6 mt-10">
                                        <label
                                            htmlFor="fullName"
                                            className="mb-2 block font-thin text-sm"
                                        >
                                             Category Title
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="flex flex-col items-start">
                                            <input
                                                type="text"
                                               
                                                placeholder=" Please write the title of your category in English here."
                                                className={`block w-full ${
                                                    errors.titleAmh
                                                        ? "ring-1 ring-red-400"
                                                        : ""
                                                } rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 `}
                                                {...register("titleAmh")}
                                                value={categoryData.titleAmh}
                                                onChange={(e) => {
                                                    setCategoryData({
                                                        ...categoryData,
                                                        titleAmh:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>
                                        {errors.titleAmh && (
                                            <span className="text-xs text-red-400 ml-2 mt-1">
                                                {errors.titleAmh.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="cols-span-2 mx-6 mt-12">
                                        <label
                                            htmlFor="fullName"
                                            className="mb-2 block font-normal text-sm"
                                        >
                                            የመደብ ርዕስ
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="flex flex-col items-start">
                                            <input
                                                type="text"
                                                placeholder="እባክዎ የመደብ ርዕስ በአማርኛ እዚህ ይጻፉ።"
                                                className={`block w-full ${
                                                    errors.title
                                                        ? "ring-1 ring-red-400"
                                                        : ""
                                                } rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 `}
                                                {...register("title")}
                                                value={categoryData.title}
                                                onChange={(e) => {
                                                    setCategoryData({
                                                        ...categoryData,
                                                        title: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>
                                        {errors.title && (
                                            <span className="text-xs text-red-400 ml-2 mt-1">
                                                {errors.title.message}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-14 flex items-center mx-auto">
                                        <Button
                                            onClick={() => {
                                                setOpen(false);
                                            }}
                                            className="mt-2 mx-4 px-5 rounded-xl border-2 bg-white border-primary py-1.5 text-center font-medium text-primary"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            isLoading={loading}
                                            type="submit"
                                            isDisabled={
                                                Object.keys(errors).length > 0
                                            }
                                            className="mt-2 px-9 rounded-xl bg-primary py-2 text-center font-medium text-white"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <Image
                                        className="relative mt-12 mx-auto"
                                        src={successImg}
                                        alt="Adot Logo"
                                        width={140}
                                        height={100}
                                        priority
                                    />
                                    <div className="relative px-6 py-3 mx-auto">
                                        <p
                                            className={`my-4 text-success text-center text-lg leading-relaxed`}
                                        >
                                            Success!
                                        </p>
                                    </div>
                                    <div className="relative px-14 mx-auto pb-12">
                                        <p className="text-gray-400 text-sm text-center tracking-wide leading-loose">
                                            {editData == undefined
                                                ? "Category has been added successfully."
                                                : "Category has been updated successfully."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
            </div>
        </>
    );
};

export default AddCategoryDialog;