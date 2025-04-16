import React, { FC, useState } from "react";
import Image from "next/image";
import successImg from "../../public/common/success-img.png";
import errorImg from "../../public/common/error-img.png";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useRegisterUserMutation } from "../../api/user-api";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddUserFormData, AddUserSchema } from "@/types/form-data";
import { HiOutlineMail } from "react-icons/hi";
import { User } from "../../types/user";
import { LuUser2 } from "react-icons/lu";
import { useGetHospitalsQuery } from "@/api/doctor-api";

interface DialogProps {
  setAddDialogOpen: Function;
}

export const AddUserDialog: FC<DialogProps> = ({ setAddDialogOpen }) => {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUserFormData>({
    mode: "onBlur",
    resolver: zodResolver(AddUserSchema),
  });

  const { data } = useGetHospitalsQuery();

  const [selectedId, setSelectedId] = useState("");
  const changeHospital = (id: string) => {
    setSelectedId(id)
    console.log(selectedId)
    
  };


  console.log(selectedId);

  const hospitals = data?.data;

  const roles = [
    {
      name: "Super Admin",
      desc: "Access to dashboard and user, insights, topics and categories management",
    },
    {
      name: "Admin",
      desc: "Access to dashboard and insights, topics and categories management",
    },
    {
      name: "Content Manager",
      desc: "Access to insights, topics and categories management",
    },
    {
      name: "Hospital Admin",
      desc: "Access to Doctors and Patients management",
    },
  ];

  const [currRole, setRole] = useState("Content Manager");
  const changeRole = (e: any) => {
    setRole(e.currentKey);
  };

  const [createUser] = useRegisterUserMutation();

  const onSubmit: SubmitHandler<AddUserFormData> = async (data) => {
    setLoading(true);

    const dataToSend: Pick<
      User,
      "firstName" | "lastName" | "email" | "role" | "hospitalId"
    > = {
      ...data,
      role: currRole,
      ...(selectedId && {
        hospitalId: selectedId,
      }),
    };

    const res: any = await createUser({ dataToSend });

    if (res?.data?.statusCode == "200") {
      setTimeout(() => {
        setAddDialogOpen(false);
      }, 6000);
    } else {
      setMessage(messages.error);
      setTimeout(() => {
        setAddDialogOpen(false);
      }, 2000);
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
                    Register Member
                  </span>
                  {/*body*/}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full grid grid-cols-2 h-full mt-6 mb-12">
                      <div className="w-full col-span-1 pr-8 mt-4 pl-4">
                        <span className="text-sm ml-2 mb-2 text-gray-400">
                          First name
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
                            } pl-10 text-gray-900 bg-[#F2F2F2] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
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
                          Last name
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
                            } pl-10 text-gray-900 bg-[#F2F2F2] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
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
                            id="email"
                            type="email"
                            {...register("email")}
                            className={`block w-full h-11 rounded-full py-1.5 ${
                              errors.email ? "ring-1 ring-red-400" : ""
                            } pl-10 text-gray-900 bg-[#F2F2F2] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            placeholder="you@example.com"
                          />
                        </div>
                        {errors.email && (
                          <span className="text-xs text-red-400 mt-1">
                            {errors.email.message}
                          </span>
                        )}
                      </div>
                      <div className="w-full col-span-1 text-sm pr-8 mt-4 pl-4">
                        <span className="text-sm ml-2 mb-2 text-gray-400">
                          Role
                        </span>
                        <Select
                          aria-label="select"
                          size="sm"
                          radius="full"
                          className="max-w-xs mt-2"
                          value={currRole}
                          onSelectionChange={changeRole}
                          placeholder="Content Manager"
                        >
                          {roles.map((role) => (
                            <SelectItem
                              textValue={currRole}
                              key={role.name}
                              color={"primary"}
                              className="text-secondary"
                            >
                              <span
                                className={`${
                                  currRole == role.name ? "font-semibold" : ""
                                }`}
                              >
                                {role.name}
                              </span>
                              <p className="text-xs text-gray-300">
                                {role.desc}
                              </p>
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      {currRole === "Hospital Admin" && (
                        <div className="w-full col-span-1 text-sm pr-8 mt-4 pl-4">
                          <span className="text-sm ml-2 mb-2 text-gray-400">
                            Hospital Name
                          </span>
                          <Select
                            aria-label="select"
                            size="sm"
                            radius="full"
                            className="max-w-xs mt-2"
                            value={selectedId} // Use the hospital's ID as the value
                            onSelectionChange={(id) => changeHospital(Array.from(id)[0]?.toString())}
                            placeholder="Select a hospital"
                          >
                            {hospitals?.map((hospital:any) => (
                              <SelectItem
                                key={hospital._id}
                                textValue={hospital.name} // Display the hospital name
                                value={hospital._id} // Use the ID as the value
                                color={"primary"}
                                className="text-secondary"
                              >
                                <span
                                  className={`${
                                    selectedId === hospital._id
                                      ? "font-semibold"
                                      : ""
                                  }`}
                                >
                                  {hospital.name}
                                </span>
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      )}
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
                        isDisabled={Object.keys(errors).length > 0}
                        isLoading={loading}
                      >
                        Register
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
                  {/*body*/}
                  <div className="flex relative px-6 py-3 mx-auto">
                    <p
                      className={`my-4 ${message.textColor} w-full text-center text-lg leading-relaxed`}
                    >
                      {message.detail}
                    </p>
                  </div>
                  {message.detail === "Succeeded!" && <div className="relative px-24 py- mx-auto">
                    <p className="my- text-gray-400 text-sm text-center tracking-wide leading-loose">
                      The user has been registered successfully! A link has been
                      sent to their email for further steps.
                    </p>
                  </div>}

                  {/*footer*/}
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

export default AddUserDialog;
