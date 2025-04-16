import React, { FC, useState } from "react";
import Image from "next/image";
import successImg from "../../public/common/success-img.png";
import errorImg from "../../public/common/error-img.png";
import { User } from "@/types/user";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Avatar, Button, Radio, RadioGroup } from "@nextui-org/react";
import { useUpdateRoleMutation } from "../../api/user-api";

interface DialogProps {
    user: User | undefined;
    setIsDialogOpen: Function;
}

export const UpdateRoleDialog: FC<DialogProps> = ({
    user,
    setIsDialogOpen,
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
    ];

    const [loading, setLoading] = useState(false);
    const [updateUser] = useUpdateRoleMutation();

    const changeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRole(e.target.value);
    };

    const updateRole = async () => {
        setLoading(true);

        if (!user || !currRole) return;

        const data = {
            _id: user._id,
            newRole: currRole,
        };

        const res: any = await updateUser({ data });

        if (res?.data?.statusCode == "200") {
            setTimeout(() => {
                setIsDialogOpen(false);
            }, 2000);
        } else {
            setMessage(messages.error);
            setTimeout(() => {
                setIsDialogOpen(false);
            }, 2000);
        }
        setLoading(false);
        setIsMessage(true);
    };

    const [message, setMessage] = useState(messages.success);
    const [currRole, setRole] = useState(user?.role);
    const [isMessage, setIsMessage] = useState(false);

    return (
        <>
            <div>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-full my-6 mx-auto max-w-xl rounded-2xl">
                        {/*content*/}
                        <div className="rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <button
                                onClick={() => {
                                    setIsDialogOpen(false);
                                }}
                                className="ml-auto mt-4 mr-4"
                            >
                                <IoIosCloseCircleOutline className="h-7 w-7 text-gray-400" />
                            </button>

                            {!isMessage ? (
                                <div className="grid grid-cols-2 px-10 text-gray-500">
                                    <span className="px-4 col-span-2 text-primary text-lg">
                                        Update user role
                                    </span>
                                    {/*left side*/}
                                    <div className="col-span-1 mb-10">
                                        {user?.profileImage ? (
                                            <Avatar
                                                src={user.profileImage}
                                                alt="Profile"
                                                className="w-28 h-28 relative mt-10 mx-4"
                                            />
                                        ) : (
                                            <Avatar
                                                className="w-28 h-28 relative mt-10 mx-4 text-4xl"
                                                name={user?.firstName[0]}
                                            />
                                        )}

                                        {/*body*/}
                                        <div className="relative px-4 mx-auto">
                                            <p className="flex mt-4 mb-2 leading-relaxed">
                                                {user?.firstName}{" "}
                                                {user?.lastName}
                                            </p>
                                            <p className="text-sm mb-2 text-gray-400">
                                                {user?.email}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {user?.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/*right side*/}
                                    <div className="col-span-1 text-sm mt-2">
                                        <RadioGroup
                                            color="primary"
                                            size="sm"
                                            className="!mb-1"
                                            defaultValue={user?.role}
                                            onChange={(e) => changeRadio(e)}
                                        >
                                            {roles.map((role) => (
                                                <Radio
                                                    key={role.name}
                                                    value={role.name}
                                                    description={role.desc}
                                                    className="mt-2"
                                                >
                                                    <span
                                                        className={`${
                                                            currRole ==
                                                            role.name
                                                                ? "text-primary font-semibold"
                                                                : ""
                                                        }`}
                                                    >
                                                        {role.name}
                                                    </span>
                                                </Radio>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    {/*footer*/}
                                    <div className="flex items-center col-span-2 mx-auto justify-end p-6 mb-6 mt-3">
                                        <Button
                                            className="outline text-primary border-1 border-primary bg-white text-sm px-7 py-2 rounded-full outline-none focus:outline-none mr-5 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() =>
                                                setIsDialogOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="text-white bg-primary text-sm px-8 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => updateRole()}
                                            isLoading={loading}
                                        >
                                            Update
                                        </Button>
                                    </div>
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
                                    <div className="relative px-24 py- mx-auto">
                                        <p className="my- text-gray-400 text-sm text-center tracking-wide leading-loose">
                                            The role of {user?.firstName}{" "}
                                            {user?.lastName} has been
                                            successfully changed to {currRole}!
                                        </p>
                                    </div>

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

export default UpdateRoleDialog;
