import React, { useState } from "react";
import Image from "next/image";
import successImg from "../../../public/common/success-img.png";
import errorImg from "../../../public/common/error-img.png";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { HiCalendar, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { LuUser2 } from "react-icons/lu";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddPatientFormData, AddPatientSchema } from "@/types/form-data";
import {
  useAddPatientForDoctorMutation,
  useGetPatientsForDoctorQuery,
} from "@/api/doctor-api";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";

interface DialogProps {
  setAddPatientDialogOpen: (open: boolean) => void;
  refetch: () => void;
}

export default function AddNewPatientForm({
  setAddPatientDialogOpen,
  refetch,
}: DialogProps) {
  const messages = {
    success: {
      detail: "Succeeded!",
      img: successImg,
      textColor: "text-success",
      bgColor: "bg-[#DBF7E0]",
    },
    error: {
      detail: "An error has occurred!",
      img: errorImg,
      textColor: "text-red-500",
      bgColor: "bg-red-50",
    },
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(messages.success);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [ultraSoundCheck, setUltraSoundCheck] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddPatientFormData>({
    mode: "onBlur",
    resolver: zodResolver(AddPatientSchema),
  });

  const [addPatientForDoctor] = useAddPatientForDoctorMutation();
 

  const onSubmit: SubmitHandler<AddPatientFormData> = async (data) => {
    setLoading(true);

    const patientData = {
      firstName: data.firstName,
      lastName: data.lastName,
      ...(data.email && { email: data.email }),
      ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
      ...(data.menstrualDate && { lastMenstrualCycle: data.menstrualDate }),
      ...(data.gestationalWeek && {
        gestationalAge: parseInt(data.gestationalWeek),
      }),
      ...(data.firstUltrasound && {
        firstUltrasoundDate: data.firstUltrasound,
      }),
    };

    try {
      const res = await addPatientForDoctor({
        patientData,
        doctorId: id as string,
      }).unwrap();
      refetch();

      setMessage(messages.success);
      setIsMessageVisible(true);

      setTimeout(() => {
        setAddPatientDialogOpen(false);
      }, 3000);
    } catch (error) {
      const backendError =  "An error has occurred!";
      setMessage({ ...messages.error, detail: backendError });
      setIsMessageVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative w-full my-6 mx-auto max-w-2xl rounded-2xl">
        <div className="rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {/* Header */}
          <button
            onClick={() => setAddPatientDialogOpen(false)}
            className="ml-auto mt-4 mr-4"
          >
            <IoIosCloseCircleOutline className="h-7 w-7 text-gray-400" />
          </button>

          {!isMessageVisible ? (
            <div className="px-10 text-gray-500">
              <span className="px-4 col-span-2 text-primary text-lg">
                Add New Patient
              </span>
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full grid grid-cols-2 h-full mt-6 mb-12 gap-2">
                  {/* First Name */}
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

                  {/* Last Name */}
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

                  {/* Email */}
                  <div className="w-full col-span-1 pr-8 mt-4 pl-4">
                    <span className="text-sm ml-2 mb-2 text-gray-400">
                      Email
                    </span>

                    <div className="relative rounded-md mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <HiOutlineMail
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
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


                  {/* Phone Number */}
                  <div className="w-full col-span-1 pr-8 mt-4 pl-4">
                    <span className="text-sm ml-2 mb-2 text-gray-400">
                      Phone Number
                    </span>
                    <div className="relative rounded-md mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <HiOutlinePhone
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        type="text"
                        {...register("phoneNumber", {
                          onChange: (e) => {
                            const value = e.target.value.trim();
                            if (/^(0|\+251)?[79]\d{8}$/.test(value)) {
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

                  {/* Ultrasound Check */}
                  <div className="w-full col-span-2 pr-8 mt-4 pl-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={ultraSoundCheck}
                        onChange={() => setUltraSoundCheck(!ultraSoundCheck)}
                      />
                      <span>Have you ever had an ultrasound before?</span>
                    </label>
                  </div>

                  {/* Last Menstrual Period */}
                  {!ultraSoundCheck && (
                    <div className="w-full col-span-2 pr-8 mt-4 pl-4">
                      <span className="text-sm ml-2 mb-2 text-gray-400">
                        Last Menstrual Period
                      </span>
                      <div className="relative rounded-md mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <HiCalendar
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          type="date"
                          {...register("menstrualDate")}
                          className={`block w-full h-11 rounded-full py-1.5 pr-3 ${
                            errors.menstrualDate ? "ring-1 ring-red-400" : ""
                          } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                        />
                      </div>
                      {errors.menstrualDate && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors.menstrualDate.message}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Ultrasound and Gestational Week Fields */}
                  {ultraSoundCheck && (
                    <div className="w-full col-span-2 flex">
                      <div className="w-[50%] pr-8 mt-4 pl-4">
                        <span className="text-sm ml-2 mb-2 text-gray-400">
                          First Ultrasound Date
                        </span>
                        <div className="relative rounded-md mt-2">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <HiCalendar
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="date"
                            {...register("firstUltrasound")}
                            className={`block w-full h-11 rounded-full py-1.5 pr-3 ${
                              errors.firstUltrasound
                                ? "ring-1 ring-red-400"
                                : ""
                            } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                          />
                        </div>
                        {errors.firstUltrasound && (
                          <span className="text-xs text-red-400 mt-1">
                            {errors.firstUltrasound.message}
                          </span>
                        )}
                      </div>

                      <div className="w-[50%] pr-8 mt-4 pl-4">
                        <span className="text-sm ml-2 mb-2 text-gray-400">
                          Gestational Week
                        </span>
                        <div className="relative rounded-md mt-2">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <HiCalendar
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="42"
                            {...register("gestationalWeek")}
                            className={`block w-full h-11 rounded-full py-1.5 pr-3 ${
                              errors.gestationalWeek
                                ? "ring-1 ring-red-400"
                                : ""
                            } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            placeholder="1"
                          />
                        </div>
                        {errors.gestationalWeek && (
                          <span className="text-xs text-red-400 mt-1">
                            {errors.gestationalWeek.message}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center col-span-2 mx-auto justify-end p-6 mb-6 mt-3">
                  <Button
                    className="outline text-primary border-1 border-primary bg-white text-sm px-7 py-2 rounded-full outline-none focus:outline-none mr-5 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setAddPatientDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="text-white bg-primary text-sm px-8 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                    disabled={Object.keys(errors).length > 0 || loading}
                  >
                    {loading ? "Loading..." : "Register"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mb-14">
              <Image
                className="relative mt-6 mx-auto"
                src={message.img}
                alt="Status Image"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
