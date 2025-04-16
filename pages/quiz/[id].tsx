import SearchBar from "@/components/common/SearchBar";
import AddQuizForm from "@/components/quiz/AddQuizForm";
import RootLayout from "@/layouts/RootLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React from "react";
import Image from "next/image";
import { useGetQuestionQuery } from "@/api/quiz-api";
import { Skeleton } from "@nextui-org/react"; // Import Skeleton for the shimmer effect

function EditQuiz() {
    const router = useRouter();
    const { id } = router.query;
    const { data, isLoading, isError, isSuccess } = useGetQuestionQuery({ id: id as string });
    const userData: any = useSession();

    const user = {
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        profileImage: "",
    };

    if (userData.status === "authenticated") {
        user.name = userData.data.profile.name;
        user.firstName = userData.data.profile.firstName;
        user.lastName = userData.data.profile.lastName;
        user.email = userData.data.profile.email;
        user.role = userData.data.profile.role;
        if (userData.data.profile.profileImage) user.profileImage = userData.data.profile.profileImage;
    }

    return (
        <RootLayout>
            {isLoading && (
                <div className="mx-20 my-6 h-full">
                    {/* Shimmer Effect (Skeletons) */}
                    <Skeleton className="h-10 w-full mb-6" />
                    <Skeleton className="h-8 w-1/2 mb-6" />
                    <Skeleton className="h-60 w-full mb-6 rounded-xl" />
                    <Skeleton className="h-60 w-full mb-6 rounded-xl" />
                </div>
            )}

            {isError && <div>Something went wrong</div>}

            {isSuccess && (
                <>
                    <Head>
                        
                         Question</Head>
                    <div className="mx-16 mt-6 h-[100%]">
                        <div className="flex items-center justify-between h-20 w-full mb-4 rounded-3xl bg-primary pr-14 pl-8">
                            <div className="relative">
                                <div className="text-white text-sm rounded-xl pt-0.5 w-96 h-full">
                                <p>Quiz Edit Page</p>
                                </div>
                            </div>
                            <div className="flex items-center text-right">
                                <div className="mr-4">
                                    <p className="text-sm text-white font-medium">{user.name}</p>
                                    <p className="text-xs text-white text-opacity-70">{user.role}</p>
                                </div>
                                <div className="ring-1 rounded-full ring-[#f4e4f4] p-1">
                                    {user.profileImage ? (
                                        <Image
                                        src={user.profileImage}
                                        alt="Profile"
                                        width={50}
                                        height={50}
                                        className="w-10 h-10 rounded-full"
                                        title={user.email}
                                        />
                                    ) : (
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-400">
                                        <span className="font-medium text-xs leading-none text-white">
                                            {user.firstName[0]}
                                            {user.lastName[0]}
                                        </span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white mt-8 h-[100%] rounded-xl overflow-scroll shadow-md border-gray-300">
                            <div className="my-10 mx-8 px-6 font-semibold text-xl text-secondary">
                                Edit Quiz Question
                            </div>
                            <div className="mb-32 mx-8">
                                <AddQuizForm quizQuestion={data?.data} isEdit={true} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </RootLayout>
    );
}

export default EditQuiz;
