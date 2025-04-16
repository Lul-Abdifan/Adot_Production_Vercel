"use client";

import { FC, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { Avatar, Button } from "@nextui-org/react";
import { useUpdatePasswordMutation } from "@/api/user-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { UpdatePasswordFormData, UpdatePasswordSchema } from "@/types/form-data";
import { MdOutlineLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useGetProfileQuery } from "@/api/user-api";

interface UpdatePasswordProps {}

export const UpdatePassword: FC<UpdatePasswordProps> = ({}) => {
    const [loading, setLoading] = useState(false);
    const [updatePassword] = useUpdatePasswordMutation();
    const router = useRouter();
    const { data } = useGetProfileQuery();

    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<UpdatePasswordFormData>({
        mode: "onSubmit",
        resolver: zodResolver(UpdatePasswordSchema),
    });

    const showSuccessMessage = () => {
        toast.success("You have successfully changed your password!", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const showErrorMessage = () => {
        toast.error("Unknow Error occurred! Please reach out to superadmins of the dashboard", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const showPassMismatchErrorMessage = () => {
        toast.error("New Password must be the same as Confirm Password", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const showOldPassMismatchErrorMessage = () => {
        toast.error("The old password is not correct", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const showNoPassChangeErrorMessage = () => {
        toast.error("The old password is not correct", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const onSubmit: SubmitHandler<UpdatePasswordFormData> = async (data) => {
        setLoading(true);
        toast.dismiss();

        const { oldPassword, newPassword, confirmPassword } = data;

        const dataToSend = {
            oldPassword,
            newPassword,
        };

        if (newPassword !== confirmPassword) {
            showPassMismatchErrorMessage();
            setError("confirmPassword", {
                type: "manual",
                message: "Confirm password must be the same as new password",
            });
            setLoading(false);
            return;
        }

        const res: any = await updatePassword({ data: dataToSend });

        if (res?.error?.data && res.error.data.statusCode == "401") {
            showOldPassMismatchErrorMessage();
            setError("oldPassword", {
                type: "manual",
                message: "The old password is not correct",
            });
        } else if(res?.error?.data && res.error.data.statusCode == "400") {
            showNoPassChangeErrorMessage();
            setError("newPassword",{
                type: "manual",
                message: "The new password must be different from the old one",
            });
        } else if (res?.data && res.data.statusCode == "200") {
            showSuccessMessage();
            setTimeout(() => {
                router.push("/");
            }, 700);
        } else {
            showErrorMessage();
        }

        setLoading(false);
    };

    return (
        <div className="">
            <ToastContainer />
            <div className="bg-primary pt-8 pl-20 h-28 rounded-2xl my-5">
                {data?.data.user.profileImage ? (
                    <div className="w-28 h-28">
                        <Avatar
                            src={data?.data.user.profileImage}
                            className="w-28 h-28 text-large"
                        />
                    </div>
                ) : (
                    <Avatar
                        name={
                            data
                                ? data?.data.user.firstName[0] +
                                  data?.data.user.lastName[0]
                                : ""
                        }
                        className="w-28 h-28 text-large z-1"
                    />
                )}
            </div>
            <div className="rounded-2xl relative flex flex-col mt-14 w-1/2 bg-white border-1 outline-none focus:outline-none">
                <div className="px-10 text-gray-500">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-full h-full mt-6 mb-12">
                            <div className="w-full col-span-1 pr-8 mt-4 pl-4">
                                <span className="text-sm ml-2 mb-2 text-gray-400">
                                    Old Password
                                </span>
                                <div className="relative rounded-md mt-2">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MdOutlineLock
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="oldPassword"
                                        type={oldPasswordVisible ? "text" : "password"}
                                        {...register("oldPassword")}
                                        onFocus={() => clearErrors("oldPassword")}
                                        className={`block w-full h-11 rounded-full py-1.5 ${
                                            errors.oldPassword
                                                ? "ring-1 ring-red-400"
                                                : ""
                                        } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                        placeholder="********"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
                                    >
                                        {oldPasswordVisible ? (
                                            <MdVisibilityOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <MdVisibility className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                {errors.oldPassword && (
                                    <span className="text-xs text-red-400 mt-1">
                                        {errors.oldPassword.message}
                                    </span>
                                )}
                            </div>

                            <div className="w-full col-span-1 pr-8 mt-4 pl-4">
                                <span className="text-sm ml-2 mb-2 text-gray-400">
                                    New Password
                                </span>
                                <div className="relative rounded-md mt-2">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MdOutlineLock
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="newPassword"
                                        type={newPasswordVisible ? "text" : "password"}
                                        {...register("newPassword")}
                                        onFocus={() => clearErrors("newPassword")}
                                        className={`block w-full h-11 rounded-full py-1.5 ${
                                            errors.newPassword
                                                ? "ring-1 ring-red-400"
                                                : ""
                                        } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                        placeholder="********"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                                    >
                                        {newPasswordVisible ? (
                                            <MdVisibilityOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <MdVisibility className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                {errors.newPassword && (
                                    <span className="text-xs text-red-400 mt-1">
                                        {errors.newPassword.message}
                                    </span>
                                )}
                            </div>

                            <div className="w-full col-span-1 pr-8 mt-4 pl-4">
                                <span className="text-sm ml-2 mb-2 text-gray-400">
                                    Confirm Password
                                </span>
                                <div className="relative rounded-md mt-2">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MdOutlineLock
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        type={confirmPasswordVisible ? "text" : "password"}
                                        {...register("confirmPassword")}
                                        onFocus={() => clearErrors("confirmPassword")}
                                        className={`block w-full h-11 rounded-full py-1.5 ${
                                            errors.confirmPassword
                                                ? "ring-1 ring-red-400"
                                                : ""
                                        } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                        placeholder="********"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                    >
                                        {confirmPasswordVisible ? (
                                            <MdVisibilityOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <MdVisibility className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                {errors.confirmPassword && (
                                    <span className="text-xs text-red-400 mt-1">
                                        {errors.confirmPassword.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center col-span-2 mx-auto justify-start px-6 mb-6">
                            <Button
                                className="outline text-primary border-1 border-primary bg-white text-sm px-7 py-2 rounded-full outline-none focus:outline-none mr-5 mb-1 ease-linear transition-all duration-150"
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="text-white bg-primary text-sm px-8 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="submit"
                                isDisabled={Object.keys(errors).length > 0}
                                isLoading={loading}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;
