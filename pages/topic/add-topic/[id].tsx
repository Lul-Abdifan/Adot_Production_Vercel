import SearchBar from "@/components/common/SearchBar";
import AddTopicForm from "@/components/topic/AddTopicForm";
import RootLayout from "@/layouts/RootLayout";
import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";

function Topics() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <RootLayout>
            <Head>Add Topic</Head>
            <div className="mx-16 my-6 h-full">
                <SearchBar text={"topics"} />
                <div className="bg-white h-[77%] rounded-xl overflow-scroll shadow-md border-gray-300">
                    <div className=" my-10 mx-8 px-6 font-semibold text-xl text-secondary">
                        Add Topic
                    </div>
                    <div className="my-6 mx-8">
                        {id?.toString() && id.toString() == "1" ? (
                            <AddTopicForm />
                        ) : (
                            <AddTopicForm selectedCategory={id?.toString()} />
                        )}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}

export default Topics;
