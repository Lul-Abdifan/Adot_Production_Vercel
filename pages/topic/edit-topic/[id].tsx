import { useGetTopicByIdQuery } from "@/api/topic-api";
import SearchBar from "@/components/common/SearchBar";
import EditTopicForm from "@/components/topic/EditTopicForm";
import RootLayout from "@/layouts/RootLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

function Topics() {
    const router = useRouter();
    const { id } = router.query;
    const { data, isSuccess } = useGetTopicByIdQuery(id as string);

    return (
        <RootLayout>
            <Head>Edit Topic</Head>
            {isSuccess && (
                <div className="mx-16 my-6 h-full">
                    <SearchBar text={"topics"} />
                    <div className="bg-white h-[77%] rounded-xl overflow-scroll shadow-md border-gray-300">
                        <div className="my-10 mx-8 px-6 font-semibold text-xl text-secondary">
                            Edit Topic
                        </div>
                        <div className="my-6 mx-8">
                            <EditTopicForm topic={data?.data} />
                        </div>
                    </div>
                </div>
            )}
        </RootLayout>
    );
}

export default Topics;