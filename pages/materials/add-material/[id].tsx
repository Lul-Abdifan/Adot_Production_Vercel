"use client";

import SearchBar from "@/components/common/SearchBar";
import AddMaterialForm from "@/components/materials/AddMaterialForm";
import RootLayout from "@/layouts/RootLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

function AddMaterial() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <RootLayout>
            <Head>
                <title>Add Material</title>
            </Head>
            <div className="mx-16 my-6 h-full">
                <SearchBar text={"materials"} />
                <div className="bg-white h-[77%] rounded-xl overflow-scroll shadow-md border-gray-300">
                    <div className="my-10 mb-[-20px] mx-8 px-6 font-semibold text-xl text-secondary">
                        Add Material
                    </div>
                    <div className="my-6 mx-8">
                        {id?.toString() && id.toString() === "1" ? (
                            <AddMaterialForm />
                        ) : (
                            <AddMaterialForm  />
                        )}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}

export default AddMaterial;
