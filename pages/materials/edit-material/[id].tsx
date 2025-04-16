"use client";

import SearchBar from "@/components/common/SearchBar";
import RootLayout from "@/layouts/RootLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import EditMaterialForm with SSR disabled
const EditMaterialForm = dynamic(
  () => import("@/components/materials/EditMaterialForm"),
  {
    ssr: false,
  }
);

function EditMaterial() {
  const router = useRouter();
  const { id } = router.query;

  // Simulate material data
  const [materialData, setMaterialData] = useState<any | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      // Simulate fetching material data
      setMaterialData({
        id,
        rank: 1,
        title: "Sample Material Title",
        description: "This is the English description.",
        titleAmh: "የናም ርዕስ",
        descriptionAmh: "ይህ የአማርኛ ዝርዝር ነው።",
        thumbnailImage: "/sample-image.jpg",
        topic: "Sample Topic",
      });
      setIsSuccess(true);
    }
  }, [id]);

  return (
    <RootLayout>
      <Head>
        <title>Edit Material</title>
      </Head>
      {isSuccess && materialData && (
        <div className="mx-16 my-6 h-full">
          <SearchBar text="materials" />
          <div className="bg-white h-[77%] rounded-xl overflow-scroll shadow-md border-gray-300">
            <div className="my-5 mx-8 px-6 font-semibold text-xl text-secondary">
              Edit Material
            </div>
            <div className="my-6 mt-[-20px] mx-8">
              <EditMaterialForm material={materialData} />
            </div>
          </div>
        </div>
      )}
    </RootLayout>
  );
}

export default EditMaterial;
