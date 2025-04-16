"use client";

import SearchBar from "@/components/common/SearchBar";
import AddInsightForm from "@/components/insights/AddInsightForm";
import RootLayout from "@/layouts/RootLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

function AddInsight() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <RootLayout>
            <Head>Add Insight</Head>
            <div className="mx-16 my-6 h-full">
                <SearchBar text={"insights"} />
                <div className="bg-white h-[77%] rounded-xl overflow-scroll shadow-md border-gray-300">
                    <div className=" my-10 mx-8 px-6 font-semibold text-xl text-secondary">
                        Add Insight
                    </div>
                    <div className="my-6 mx-8">
                        {id?.toString() && id.toString() == "1" ? (
                            <AddInsightForm />
                        ) : (
                            <AddInsightForm selectedTopic={id?.toString()} />
                        )}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}

export default AddInsight;
