"use client";

import Link from "next/link";
import Image from "next/image";
import { FC, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import signInImage from "../../public/auth/signin-img.png";
import adotLogo from "../../public/common/adot-logo.png";
import { signIn } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginFormData, LoginFormSchema } from "@/types/form-data";
import { error } from "console";

interface LogInFormProps {}

export const LoginForm: FC<LogInFormProps> = ({}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        mode: "onBlur",
        resolver: zodResolver(LoginFormSchema),
    });

    const showSuccessMessage = () => {
        toast.success("You have successfully logged in!", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const showErrorMessage = () => {
        toast.error("Login failed. Please try again.", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        setLoading(true);
        toast.dismiss();

        const { email, password } = data;

        const dataToSend = {
            email: email,
            password: password,
            redirect: false,
        };

        const res = await signIn("credentials", dataToSend);
        console.log(res)

        if (res && res.status == 200) {
            showSuccessMessage();
            setTimeout(() => {
                router.push("/");
            }, 500);
        } else {
            console.log(res)
            showErrorMessage();
        }

        setLoading(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const bgImage =
        "https://res.cloudinary.com/dr8ozjurp/image/upload/v1702039103/Rectangle_4883_qk9nw2.png";

    return (
        <div
            className="font-epilogue flex h-screen xl:px-48 lg:px-32 md:px-24 px-24 md:py-32 py-24"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >s
            <ToastContainer />
            <div className="w-full h-full md:grid md:grid-cols-2 rounded-3xl">
                {/* Left Side */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full h-full md:col-span-1 bg-[#F9F9F9] md:py-12 py-6 xl:px-20 lg:px-16 md:px-10 px-14 text-gray-700 rounded-l-3xl">
                        <div className="pt-4">Email</div>
                        <div className="relative mt-4 roun   ded-md">
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
                        <div className="pt-8 flex justify-between">
                            <span>Password</span>
                            <Link
                                href={"/login/forgot-password"}
                                className="text-right text-primary text-sm pt-0.5"
                            >
                                Forgot password?
                            </Link>
                        </div>
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
                                className={`block w-full h-11 rounded-full py-1.5 pl-10  ${
                                    errors.password
                                        ? "ring-1 ring-red-400"
                                        : "ring-1 ring-green-400"
                                } text-gray-900 bg-[#F2F2F2] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                placeholder="**********"
                            />

                            <div className=" absolute inset-y-0 right-7 flex items-center pl-3">
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                >
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
                        {/* <div>
                            {Object.keys(errors).map((key) => (
                                <li>{errors[key]}</li>
                            ))}
                        </div> */}

                        {/* Login button */}

                        <Button
                            type="submit"
                            className="w-full bg-primary mt-12 h-11 rounded-full text-white"
                            isLoading={loading}
                            isDisabled={Object.keys(errors).length > 0}
                        >
                            Login
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
                </form>

                {/* Right Side */}

                <div className="w-full h-full col-span-1 bg-primary rounded-r-3xl py-12 px-20 hidden md:block">
                    <div className="text-white font-bold text-4xl -ml-2">
                        Welcome to Adot!
                    </div>
                    <div className="text-white font-thin text-sm pt-3">
                        {" "}
                        Sign into our Adot admin portal so we can get started!
                    </div>
                    <Image
                        className="relative mt-9"
                        src={signInImage}
                        alt="Adot Logo"
                        width={300}
                        height={100}
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
