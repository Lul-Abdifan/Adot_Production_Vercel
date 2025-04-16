import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import { useGetFeedbacksQuery } from "@/api/user-api";
import RootLayout from "@/layouts/RootLayout";
import { SingleSelect } from "@/types/select";
import { SelectButton } from "@/components/common/SelectSingle";
import { FeedbackTable } from "@/components/user-feedback/FeedbackTable";
import { SelectMultipleButton } from "@/components/common/SelectMultiple";

export default function UserFeedbacks(){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const filterMap: any = {
        "All": {_id: "1", name: "All", value: "All"},
        "Anonymous": {_id: "3", name: "Anonymous", value: "Anonymous"},
        "Onymous": {_id: "2", name: "Onymous", value: "Onymous"},
    }; 

    const filters: SingleSelect[] = [
        {
            _id: "1",
            name: "All",
            value: "All",
        },
        {
            _id: "3",
            name: "Anonymous",
            value: "Anonymous",
        },
        {
            _id: "2",
            name: "Onymous",
            value: "Onymous",
        },
    ];

    const [selectedFilter, setSelectedFilter] = useState<SingleSelect>(filters[0]); 

    const [feedbackFilters, setFeedbackFilters] = useState({
        feedback: router.query.feedback?.toString() || "",
        rating: router.query.rating ||0,
        isAnonymous: router.query.isAnonymous?.toString() || "all",
        createdAt: router.query.createdAt?.toString() || "", 
    });

    const {data: res, refetch, isSuccess} :any = useGetFeedbacksQuery();

    const userData: any = useSession();

    const user = {
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        profileImage: "",
    };

    if (userData.status == "authenticated") {
        user.name = userData.data.profile.name;
        user.firstName = userData.data.profile.firstName;
        user.lastName = userData.data.profile.lastName;
        user.email = userData.data.profile.email;
        user.role = userData.data.profile.role;
        if (userData.data.profile.profileImage) {
            user.profileImage = userData.data.profile.profileImage;
        }
    }

    useEffect(() => {
        const fetchAndFilterFeedbacks = async () => {
            setLoading(true); // Set loading state before refetching
            const { data } = await refetch(); // Wait for refetch to complete
            
            if (data?.data) {
                // Apply the filtering logic after fetching data
                if (selectedFilter.value === 'Anonymous') {
                    const anonymousFeedbacks = data.data.filter((feedback: any) => feedback.isAnonymous === true);
                    setFeedbacks(anonymousFeedbacks);
                } else if (selectedFilter.value === 'Onymous') {
                    const onymousFeedbacks = data.data.filter((feedback: any) => feedback.isAnonymous === false);
                    setFeedbacks(onymousFeedbacks);
                } else {
                    setFeedbacks(data.data); // No filtering, show all feedbacks
                }
            }
    
            setLoading(false); // Stop loading once data is fetched and filtered
        };
    
        fetchAndFilterFeedbacks();
    }, [selectedFilter, refetch]);
    


    const changeFilter = async (e: string) => {
        setSelectedFilter(filterMap[e]);
    };

    useEffect(() => {
        if (isSuccess) {
            setFeedbacks(res?.data);
            setLoading(false);
        }
    }, [res, isSuccess]);


    return (
        <RootLayout>
            <Head>Adot Dashboard</Head>
            <div className="mx-16 mt-6 h-[100px]">
                <div className="flex items-center justify-between h-20 w-full mb-4 rounded-3xl bg-primary pr-14 pl-8">
                    <div className="relative">
                        <div className="text-white text-sm rounded-xl pt-0.5 w-96 h-full">
                            <p>Mobile User Feedbacks</p>
                        </div>
                    </div>

                    <div className="flex items-center text-right">
                        <div className="mr-4">
                            <p className="text-sm text-white font-medium">
                                {user.name}
                            </p>
                            <p className="text-xs text-white  text-opacity-70">
                                {user.role}
                            </p>
                        </div>

                        <div className="ring-1 rounded-full ring-[#f4e4f4] p-1">
                            {" "}
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
            </div>

            <div className="mx-16 my-6 h-full">
                <div className="h-[82%] -mt-5 rounded-xl overflow-scroll border-gray-300">
                    <div className="z-10 pb-6 sticky top-0">
                        <div className="h-28 w-full rounded-lg bg-white shadow-md">
                            <div className="flex items-center w-full justify-between pt-4 px-6">
                                <div className="flex font-semibold text-xl text-subtitle">
                                    <span className="flex">
                                        All User Feedbacks
                                    </span>
                                </div>

                                <div className="flex items-center space-x-8">
                                    <SelectButton
                                        options={filters}
                                        functionTrigger={changeFilter}
                                        selectedFilter={selectedFilter}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-1">
                        <FeedbackTable 
                            feedbacks={feedbacks}
                            setFeedbacks={setFeedbacks}
                            isLoading={loading}
                            setLoading={setLoading}
                        />
                    </div>
                </div>
            </div>
        </RootLayout>
    );

}