"use client";

import forgotPassImage from "../../public/auth/forgot-password-img.png";
import adotLogo from "../../public/common/adot-logo.png";
import Dialog from "../common/Dialog";
import { ForgotPasswordFormData, ForgotPasswordSchema } from "@/types/form-data";
import { config } from "@/utils/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiOutlineMail } from "react-icons/hi";


interface ForgotPasswordFormProps {}

export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        mode: "onBlur",
        resolver: zodResolver(ForgotPasswordSchema),
    });

    const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
        setLoading(true);

        const { email } = data;

        const dataToSend = {
            email: email,
        };

        // `${process.env.NEXT_PUBLIC_PROD_API_URL}/api`

        try {
            await axios.post(
              // `${config.apiUrl}/v1/admin/forgot-password`,

              `${process.env.NEXT_PUBLIC_PROD_API_URL}/v1/admin/forgot-password`,
              dataToSend
            );
            setStatus("success");
            setMessage(
                "If you've provided a valid email, an email will be sent to you. Simply follow the instructions in the email to reset your password"
            );
            setOpen(true);
        } catch (error) {
            setMessage(
                "An email has already been sent to this account. Please check your email and follow the instructions to reset your password."
            );
            setStatus("error");
            setOpen(true);
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
            {open && (
                <Dialog status={status} subText={message} setOpen={setOpen} />
            )}
            <div className="w-full h-full md:grid md:grid-cols-2 rounded-3xl">
                {/* Left Side */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full h-full md:col-span-1 bg-[#F9F9F9] md:py-12 py-6 xl:px-20 lg:px-16 md:px-10 px-14 text-gray-700 rounded-l-3xl">
                        <div className="pt-8">Email</div>
                        <div className="relative mt-4 rounded-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <HiOutlineMail
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </div>

                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                className={`block w-full h-11 rounded-full py-1.5 ${
                                    errors.email
                                        ? "ring-1 ring-red-400"
                                        : "ring-1 ring-green-400"
                                } pl-10 text-gray-900 bg-[#F2F2F2] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                placeholder="you@example.com"
                            />
                        </div>
                        {errors.email && (
                            <span className="text-xs text-red-400 ml-2 mt-1">
                                {errors.email.message}
                            </span>
                        )}

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full bg-primary mt-12 h-11 rounded-full text-white"
                            isDisabled={Object.keys(errors).length > 0}
                        >
                            Continue
                        </Button>

                        <div className="w-full flex text-black rounded-l-3xl mt-7">
                            <Link
                                href={"/login"}
                                className="w-full text-center text-primary mx-auto text-sm"
                            >
                                Return to login
                            </Link>
                        </div>

                        <Image
                            className="relative mt-20 pt-1 mx-auto"
                            src={adotLogo}
                            alt="Adot Logo"
                            width={120}
                            height={100}
                            priority
                        />
                    </div>
                </form>
                {/* Right Side */}

                <div className="w-full h-full col-span-1 bg-primary rounded-r-3xl pt-12 px-20 hidden md:block">
                    <div className="text-white font-bold text-4xl -ml-2">
                        Forgot your Password?
                    </div>
                    <div className="text-white font-thin text-sm pt-3">
                        {" "}
                        Don&apos;t worry! We&apos;ll send you a password reset
                        link. Just provide us with your email address here.
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
        </div>
    );
};
export default ForgotPasswordForm;