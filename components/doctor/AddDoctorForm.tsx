import React, { FC, useState } from "react";
import Image from "next/image";
import successImg from "../../public/common/success-img.png";
import errorImg from "../../public/common/error-img.png";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button, Select, SelectItem } from "@nextui-org/react";
import {
  useAddDoctorForHospitalMutation,
  useRegisterDoctorMutation,
} from "../../api/doctor-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddDoctorFormData, AddDoctorSchema } from "@/types/form-data";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { Doctor } from "@/types/doctor";
import { LuUser2 } from "react-icons/lu";
import { PiCornersOutLight } from "react-icons/pi";
import { useGetProfileQuery } from "@/api/user-api";
import { useSession } from "next-auth/react";

interface DialogProps {
  setAddDialogOpen: Function;
  refetch?: Function;
}

export const AddDoctorDialog: FC<DialogProps> = ({
  setAddDialogOpen,
  refetch,
}) => {
  const messages = {
    success: {
      detail: "Succeeded!",
      img: successImg,
      textColor: "text-success",
      bgColor: "bg-[#DBF7E0]",
    },
    error: {
      detail: "An error has occured!",
      img: errorImg,
      textColor: "text-red-500",
      bgColor: "bg-red-50",
    },
  };
  const userData: any = useSession();

  const user = {
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    profileImage: "",
  };

  const { data, isSuccess } = useGetProfileQuery();
  const hospitalId = data?.data?.user?.hospitalId;
  const role = data?.data?.user?.role;
  console.log(hospitalId);
  console.log(role);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddDoctorFormData>({
    mode: "onBlur",
    resolver: zodResolver(AddDoctorSchema),
  });

  const [createDoctor] = useRegisterDoctorMutation();
  const [addDoctorForHospital] = useAddDoctorForHospitalMutation();
  

  const updateErrorToBackened = (backendError: string) => {
    if (backendError) {
      messages.error.detail = backendError;
    }
  };

  const onSubmit: SubmitHandler<AddDoctorFormData> = async (data) => {
    setLoading(true);

    data.email = data.email.toLowerCase();

    const formData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      ...(data.phoneNumber !== "" && { phoneNumber: data.phoneNumber }), 
      ...(role === "Hospital Admin" && { hospitalId: hospitalId }),
    };
    let res: any;
    if (role == "Hospital Admin") {
      res = await addDoctorForHospital({ dataToSend: formData });
    } else {
      res = await createDoctor({ dataToSend: formData });
    }

    console.log(res?.error?.data?.message);

    if (res?.data?.statusCode == "200") {
      refetch?.();

      setTimeout(() => {
        setAddDialogOpen(false);
      }, 6000);
    } else {
      if (res?.error) {
        const isNetworkError = !res?.error?.data;
        if (isNetworkError) {
          updateErrorToBackened("Network error occurred.");
        } else {
          updateErrorToBackened(res?.error?.data?.message);
        }

        setMessage(messages.error);
      }
    }

    setLoading(false);
    setIsMessage(true);
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(messages.success);
  const [isMessage, setIsMessage] = useState(false);

  return (
    <>
      <div>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-full my-6 mx-auto max-w-2xl rounded-2xl">
            {/*content*/}
            <div className="rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <button
                onClick={() => {
                  setAddDialogOpen(false);
                }}
                className="ml-auto mt-4 mr-4"
              >
                <IoIosCloseCircleOutline className="h-7 w-7 text-gray-400" />
              </button>

              {!isMessage ? (
                <div className="px-10 text-gray-500">
                  <span className="px-4 col-span-2 text-primary text-lg">
                    Register Doctor
                  </span>
                  {/*body*/}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full grid grid-cols-2 h-full mt-6 mb-12">
                      <div className="w-full col-span-1 pr-8 mt-4 pl-4">
                        <span className="text-sm ml-2 mb-2 text-gray-400">
                          First Name <span className="text-red-500">*</span>
                        </span>
                        <div className="relative rounded-md mt-2">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LuUser2
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            id="email"
                            type="text"
                            {...register("firstName")}
                            className={`block w-full h-11 rounded-full py-1.5 ${
                              errors.firstName ? "ring-1 ring-red-400" : ""
                            } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            placeholder="Jane"
                          />
                        </div>
                        {errors.firstName && (
                          <span className="text-xs text-red-400 mt-1">
                            {errors.firstName.message}
                          </span>
                        )}
                      </div>

                      <div className="w-full col-span-1 pr-8 mt-4 pl-4">
                        <span className="text-sm ml-2 mb-2 text-gray-400">
                          Last Name <span className="text-red-500">*</span>
                        </span>
                        <div className="relative rounded-md mt-2">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LuUser2
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            id="email"
                            type="text"
                            {...register("lastName")}
                            className={`block w-full h-11 rounded-full py-1.5 ${
                              errors.lastName ? "ring-1 ring-red-400" : ""
                            } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            placeholder="Doe"
                          />
                        </div>
                        {errors.lastName && (
                          <span className="text-xs text-red-400 mt-1">
                            {errors.lastName.message}
                          </span>
                        )}
                      </div>
                      <div className="w-full col-span-1 pr-8 mt-4 pl-4">
                        <span className="text-sm ml-2 mb-2 text-gray-400">
                          Email <span className="text-red-500">*</span>
                        </span>
                        <div className="relative rounded-md mt-2">
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
                              errors.email ? "ring-1 ring-red-400" : ""
                            } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            placeholder="you@example.com"
                          />
                        </div>
                        {errors.email && (
                          <span className="text-xs text-red-400 mt-1">
                            {errors.email.message}
                          </span>
                        )}
                      </div>
                      <div className="w-full col-span-1 pr-8 mt-4 pl-4">
                        <span className="text-sm ml-2 mb-2 text-gray-400">
                          Phone Number
                        </span>
                        <span className="text-sm text-gray-300">
                          {`(optional)`}
                        </span>
                        <div className="relative rounded-md mt-2">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <HiOutlinePhone
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            id="phone"
                            type="text"
                            {...register("phoneNumber", {
                              onChange: (e) => {
                                const value = e.target.value.trim();
                                if (/^(0|\+251)?[79]\d{8}$/.test(value)) {
                                  // Remove leading "0" or "+251" and prepend "+251"
                                  e.target.value = `+251${value.replace(
                                    /^(0|\+251)/,
                                    ""
                                  )}`;
                                }
                              },
                            })}
                            className={`block w-full h-11 rounded-full py-1.5 ${
                              errors.phoneNumber ? "ring-1 ring-red-400" : ""
                            } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            placeholder="+251911203040"
                          />
                        </div>

                        {errors.phoneNumber && (
                          <span className="text-xs text-red-400 mt-1">
                            {errors.phoneNumber.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/*footer*/}
                    <div className="flex items-center col-span-2 mx-auto justify-end p-6 mb-6 mt-3">
                      <Button
                        className="outline text-primary border-1 border-primary bg-white text-sm px-7 py-2 rounded-full outline-none focus:outline-none mr-5 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="text-white bg-primary text-sm px-8 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                        isDisabled={Object.keys(errors).length > 0 || loading}
                        isLoading={loading}
                      >
                        {loading ? "Registering" : "Register"}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="mb-14">
                  <Image
                    className="relative mt-6 mx-auto"
                    src={message.img}
                    alt="Adot Logo"
                    width={100}
                    height={100}
                    priority
                  />

                  <div className="flex relative px-6 py-3 mx-auto">
                    <p
                      className={`my-4 ${message.textColor} w-full text-center text-lg leading-relaxed`}
                    >
                      {message.detail}
                    </p>
                  </div>
                  {message.detail !== "Succeeded!" && (
                    <button
                      className="text-white bg-primary text-sm px-6 py-2 rounded-full mx-auto block"
                      onClick={() => {
                        setIsMessage(false);
                      }}
                    >
                      Retry Again
                    </button>
                  )}
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

export default AddDoctorDialog;
