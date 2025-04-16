"use client";

import forgotPassImage from "../../public/auth/signin-img.png";
import adotLogo from "../../public/common/adot-logo.png";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ResetPasswordFormData, ResetPasswordSchema } from "@/types/form-data";
import { config } from "@/utils/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";


export const ResetPasswordForm = () => {
    const router = useRouter();
    const { token } = router.query;
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        mode: "onBlur",
        resolver: zodResolver(ResetPasswordSchema),
    });

    const showSuccessMessage = () => {
        toast.success("Your password has been reset!", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const showErrorMessage = () => {
        toast.error("Reset failed. Please try again.", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
        setLoading(true);

        const { password, confirmPassword } = data;

        if (password != confirmPassword) {
            return;
        }

        const dataToSend = {
            resetToken: token,
            newPassword: password,
        };
        try {
            await axios.put(
              // `${config.apiUrl}/v1/admin/change-password`,

              `${process.env.NEXT_PUBLIC_PROD_API_URL}/v1/admin/change-password`,
              dataToSend
            );

            showSuccessMessage();
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (error) {
            showErrorMessage();
        }

        setLoading(false);
    };

    const bgImage =
        "https://res.cloudinary.com/dr8ozjurp/image/upload/v1702039103/Rectangle_4883_qk9nw2.png";

    return (
        <div
            className="font-epilogue flex h-screen xl:px-48 lg:px-32 md:px-24 px-24 md:py-32 py-24"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            <ToastContainer />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full h-full md:grid md:grid-cols-2 rounded-3xl">
                    {/* Left Side */}

                    <div className="w-full h-full md:col-span-1 bg-[#F9F9F9] md:py-12 py-6 xl:px-20 lg:px-16 md:px-10 px-14 text-gray-700 rounded-l-3xl">
                        <div className="pt-8">New Password</div>
                        <div className="relative mt-4 rounded-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <RiLockPasswordLine
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className={`block w-full h-11 ${
                                    errors.password
                                        ? "ring-1 ring-red-400"
                                        : "ring-1 ring-green-400"
                                } rounded-full py-1.5 pl-10 text-gray-900 bg-[#F2F2F2] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                placeholder="**********"
                            />
                            <div className=" absolute inset-y-0 right-7 flex items-center pl-3">
                                <button onClick={togglePasswordVisibility}>
                                    {showPassword ? (
                                        <FaEye
                                            className="h-5 w-5 text-gray-400"
                                            size={18}
                                        />
                                    ) : (
                                        <FaEyeSlash
                                            className="h-5 w-5 text-gray-400"
                                            size={18}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                        {errors.password && (
                            <span className="text-xs text-red-400 ml-2 mt-1">
                                {errors.password.message}
                            </span>
                        )}
                        <div className="pt-8 flex justify-between">
                            Confirm Password
                        </div>
                        <div className="relative mt-4 rounded-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <RiLockPasswordLine
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </div>
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                className={`block w-full h-11 ${
                                    errors.confirmPassword
                                        ? "ring-1 ring-red-400"
                                        : "ring-1 ring-green-400"
                                } rounded-full py-1.5 pl-10 text-gray-900 bg-[#F2F2F2] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                placeholder="**********"
                            />
                            <div className=" absolute inset-y-0 right-7 flex items-center pl-3">
                                <button onClick={togglePasswordVisibility}>
                                    {showPassword ? (
                                        <FaEye
                                            className="h-5 w-5 text-gray-400"
                                            size={18}
                                        />
                                    ) : (
                                        <FaEyeSlash
                                            className="h-5 w-5 text-gray-400"
                                            size={18}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                        {errors.confirmPassword && (
                            <span className="text-xs text-red-400 ml-2 mt-1">
                                {errors.confirmPassword.message}
                            </span>
                        )}

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full bg-primary mt-12 h-11 rounded-full text-white"
                            isDisabled={Object.keys(errors).length > 0}
                        >
                            Reset
                        </Button>
                        <Image
                            className="relative mt-12 mx-auto"
                            src={adotLogo}
                            alt="Adot Logo"
                            width={120}
                            height={100}
                            priority
                        />
                    </div>

                    {/* Right Side */}

                    <div className="w-full h-full col-span-1 bg-primary rounded-r-3xl pt-12 px-20 hidden md:block">
                        <div className="text-white font-bold text-4xl -ml-2">
                            Reset Password
                        </div>
                        <div className="text-white font-thin text-sm pt-3">
                            {" "}
                            To activate your account, please reset your password
                            before logging in. Choose a strong password at least
                            7 characters and 1 UPPERCASE.
                        </div>
                        <Image
                            className="relative mt-9"
                            src={forgotPassImage}
                            alt="Adot Logo"
                            width={270}
                            height={100}
                            priority
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};
export default ResetPasswordForm;