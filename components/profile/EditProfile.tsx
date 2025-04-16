"use client";

import { FC, useEffect, useState, useRef } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Avatar, Button, Skeleton } from "@nextui-org/react";
import { User, UserFormData} from "../../types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { UpdateProfileFormData, UpdateProfileSchema } from "@/types/form-data";
import { LuUser2 } from "react-icons/lu";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/api/user-api";
import { TbEdit } from "react-icons/tb";

interface EditProfileProps {}

export const EditProfile: FC<EditProfileProps> = ({}) => {
    const [loading, setLoading] = useState(false);
    const { data, isSuccess } = useGetProfileQuery();
    const [profileImageUrl, setProfileImageUrl] = useState<string | "">("");

    const [user, setUser] = useState<UserFormData>({
        firstName: data?.data.user.firstName || "",
        lastName: data?.data.user.lastName || "",
        email: data?.data.user.email || "",
        bio: data?.data.user?.bio || " ",
        profileImage: undefined,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<UpdateProfileFormData>({
        mode: "onBlur",
        resolver: zodResolver(UpdateProfileSchema),
    });

    useEffect(() => {
        if (isSuccess) {
            setUser(data.data.user);
            setValue("firstName", data.data.user.firstName);
            setValue("lastName", data.data.user.lastName);
            setValue("email", data.data.user.email);
            setValue("bio", data.data.user.bio || " ");
            setProfileImageUrl(data.data.user.profileImage);
        }
    }, [data, isSuccess, setValue]);
 
    const showSuccessMessage = () => {
        toast.success("You have successfully updated your profile!", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const showErrorMessage = () => {
        toast.error("Update failed. Please try again.", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const showWrongImageTypeMessage = () => {
        toast.error("Please upload a valid image file (JPEG, PNG).", {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const [updateProfile] = useUpdateProfileMutation();

    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bio, setBio] = useState(user.bio); // state for bio
    const currentBio = watch("bio");

    const handleEditBio = () => {
        setIsEditingBio(true);
    };
    
    // Save bio changes when clicking outside
    const handleSaveBio = (updatedBio: string) => {
        setIsEditingBio(false);
        setValue("bio", updatedBio); // Update the form state with the latest bio
    };

    const bioRef = useRef<HTMLDivElement>(null); // Create a reference for the bio container

    // Handle clicks outside the bio textarea
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (bioRef.current && !bioRef.current.contains(event.target as Node)) {
                setIsEditingBio(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [bioRef]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
    
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png'];
            if (validImageTypes.includes(file.type)) {
                setUser({
                    ...user,
                    profileImage: file,
                });
                setProfileImageUrl(URL.createObjectURL(file));
            } else {
                showWrongImageTypeMessage();
            }
        }
    };

    const onSubmit: SubmitHandler<UpdateProfileFormData> = async (data) => {
        setLoading(true);
        toast.dismiss();

        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("bio", data?.bio || " ");
        
        if (user.profileImage) {
            formData.append("file", user.profileImage);
        }

        const res: any = await updateProfile({ data: formData });

        if (res?.data && res?.data.statusCode == '200') {
            showSuccessMessage();
        } else {
            showErrorMessage();
        }

        setLoading(false);
    };

    return (
        <div className="">
            <ToastContainer />
            <div className="bg-primary pt-8 pl-20 h-28 rounded-2xl my-5">
                {isSuccess ? (
                    <>
                    
                        <div className="relative w-28 h-28">
                            <Avatar
                                src={profileImageUrl ? profileImageUrl : user.firstName[0] + user.lastName[0]}
                                className="w-28 h-28 text-large"
                            />

                            <label htmlFor="upload" className="absolute bottom-0 right-0">
                                <TbEdit className="h-8 w-8 rounded-full text-primary border border-primary bg-lightPrimary p-1.5 cursor-pointer" />
                                <input
                                    id="upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>    
                    </>
                ) : (
                    <Skeleton className="w-28 h-28 rounded-full text-large z-1" />
                )}
            </div>
            <div className="rounded-2xl relative flex flex-col mt-14 w-full bg-white border-1 outline-none focus:outline-none">
                <div className="px-10 text-gray-500">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-full grid grid-cols-2 h-full mt-6 mb-12">
                            <div className="col-span-1">
                                <div className="w-full pr-8 mt-4 pl-4">
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
                                            id="firstName"
                                            type="text"
                                            {...register("firstName")}
                                            className={`block w-full h-11 rounded-full py-1.5 ${
                                                errors.firstName
                                                    ? "ring-1 ring-red-400"
                                                    : ""
                                            } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                            defaultValue={user.firstName}
                                        />
                                    </div>
                                    {errors.firstName && (
                                        <span className="text-xs text-red-400 mt-1">
                                            {errors.firstName.message}
                                        </span>
                                    )}
                                </div>

                                <div className="w-full pr-8 mt-4 pl-4">
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
                                            id="lastName"
                                            type="text"
                                            {...register("lastName")}
                                            className={`block w-full h-11 rounded-full py-1.5 ${
                                                errors.lastName
                                                    ? "ring-1 ring-red-400"
                                                    : ""
                                            } pl-10 text-gray-800 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                            defaultValue={user.lastName}
                                        />
                                    </div>
                                    {errors.lastName && (
                                        <span className="text-xs text-red-400 mt-1">
                                            {errors.lastName.message}
                                        </span>
                                    )}
                                </div>

                                <div className="w-ful pr-8 mt-4 pl-4">
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
                                                errors.email
                                                    ? "ring-1 ring-red-400"
                                                    : ""
                                            } pl-10 text-gray-900 bg-[#ebebeb] placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                                            defaultValue={user.email}
                                        />
                                    </div>
                                    {errors.email && (
                                        <span className="text-xs text-red-400 mt-1">
                                            {errors.email.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="relative" ref={bioRef}>
                                <div className="mx-10 pt-4 text-[15px]">Bio</div>
                                {isEditingBio ? (
                                    // Editable bio text area
                                    <textarea
                                        className={`w-[70px] h-[225px] mx-10 mt-3 px-3 pt-3 border ${
                                            errors.bio ? "border-red-400" : "border-gray-200"
                                        } bg-white shadow-inner shodow-md text-gray-700 rounded-md resize-none`}
                                        {...register("bio")} // Register bio with validation
                                        value={currentBio}
                                        autoFocus // Auto focus on the textarea when editing
                                        onBlur={(e) => handleSaveBio(e.target.value)} // Save changes on blur (when clicking outside)
                                        style={{ height: '225px', width: '90%' }} // Ensure fixed width and height
                                    />
                                ) : (
                                    // Display mode for bio
                                    <div
                                        className="w-[70px] h-[225px] mx-10 mt-3 bg-[#ebebeb] text-gray-800 p-3 border border-gray-200 rounded-md"
                                        style={{ height: '225px', width: '90%' }} // Ensure fixed width and height
                                    >
                                        {currentBio}
                                        <TbEdit
                                            onClick={handleEditBio}
                                            className="absolute bottom-[-4px] right-[-4px] h-10 w-10 p-1 text-gray-300 cursor-pointer bg-white rounded-full border border-gray-400 hover:text-gray-600 hover:border-gray-500 flex items-center justify-center"
                                        />
                                    </div>
                                )}
                            </div>;

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

export default EditProfile;
