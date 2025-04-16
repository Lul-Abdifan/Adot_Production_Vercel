import { useGetInsightQuery } from "@/api/insight-api";
import SearchBar from "@/components/common/SearchBar";
import RootLayout from "@/layouts/RootLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import dynamic from "next/dynamic";

const EditInsightForm = dynamic(
  () => import("@/components/insights/EditInsightForm"),
  {
    ssr: false,
  }
);

function EditInsight() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isSuccess } = useGetInsightQuery(id as string);
  return (
    <RootLayout>
      <Head>Edit Insight</Head>
      {isSuccess && (
        <div className="mx-16 my-6 h-full">
          <SearchBar text={"insights"} />
          <div className="bg-white h-[77%] rounded-xl overflow-scroll shadow-md border-gray-300">
            <div className=" my-10 mx-8 px-6 font-semibold text-xl text-secondary">
              Edit Insight
            </div>
            <div className="my-6 mx-8">
              <EditInsightForm insight={data?.data?.insight} />
            </div>
          </div>
        </div>
      )}
    </RootLayout>
  );
}

export default EditInsight;
