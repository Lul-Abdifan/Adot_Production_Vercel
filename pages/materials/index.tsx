import SearchBar from "@/components/common/SearchBar";
import { SelectButton } from "@/components/common/SelectSingle";
import MaterialTable from "@/components/materials/MaterialTable";
import RootLayout from "@/layouts/RootLayout";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { IoAddOutline } from "react-icons/io5";
import { Material } from "@/types/material";
import { SingleSelect } from "@/types/select";

import { useGetMaterialQuery } from "@/api/material-api";

function Materials() {
  const { data, isSuccess, refetch, isLoading } = useGetMaterialQuery();
  const [isSplitView, setIsSplitView] = useState(false);
  const [page, setPage] = useState(1);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<SingleSelect>({
    _id: "1",
    name: "All",
    value: "all",
  });

  const router = useRouter();

  const viewFilters: SingleSelect[] = [
    {
      _id: "1",
      name: "All Materials",
      value: false,
    },
    {
      _id: "2",
      name: "By Topic",
      value: true,
    },
  ];

  const filters: SingleSelect[] = [
    {
      _id: "1",
      name: "All",
      value: "all",
    },
    {
      _id: "3",
      name: "Active",
      value: "false",
    },
    {
      _id: "2",
      name: "Archived",
      value: "true",
    },
  ];

  useEffect(() => {
    if (isSuccess && data?.data) {
    setMaterials(data.data);
    }
  }, [isSuccess, data]);

  console.log(data)
  
  return (
    <RootLayout>
      <Head>Material</Head>
      <div className="mx-16 my-6 h-full">
        <SearchBar text={"materials"} isVisible={true} onSearch={() => {}} />
        <div className="h-[84%] rounded-xl overflow-scroll">
          <div className="z-10 pb-6 px-4 sticky top-0">
            <div className="h-28 w-full rounded-lg shadow-sm bg-white border-gray-300">
              <div className="flex items-center justify-between pt-4 px-6">
                <div className="font-semibold text-xl text-subtitle">
                  Reference Materials
                </div>

                <div className="flex items-center space-x-8">
                  {!isSplitView && (
                    <>
                      <Link href={"/materials/add-material/1"}>
                        <button className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl flex items-center">
                          <IoAddOutline className="mr-4 h-4 w-4" />
                          Add Material
                        </button>
                      </Link>

                      <SelectButton
                        options={filters}
                        functionTrigger={setSelectedFilter}
                        selectedFilter={selectedFilter}
                      />
                    </>
                  )}

                  <SelectButton
                    options={viewFilters}
                    functionTrigger={setIsSplitView}
                  />
                </div>
              </div>

              <div className="w-fit ml-auto mr-9 mt-4"></div>
            </div>
          </div>

          <div>
            <MaterialTable
              isSplitView={isSplitView}
              page={page}
              materials={materials}
              router={router}
              count={materials.length}
              onPageChange={() => {}}
              onPreviousPage={() => {}}
              onNextPage={() => {}}
              pages={1}
              materialFilters={{
                page,
                limit: 10,
                sortBy: "updatedAt",
                sortOrder: "desc",
                isArchived: selectedFilter.value as string,
              }}
              sortTable={() => {}}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

export default Materials;



    // {
    //     "statusCode": "200",
    //     "message": "Reference found",
    //     "data": [
    //         {
    //             "_id": "678e8ff04f2562f3ca4523cb",
    //             "title": "new title",
    //             "description": "new description",
    //             "document": "https://storage.googleapis.com/adot_bucket_prod/Adot/reference/doc/Mon Jan 20 2025 18:03:27 GMT+0000 (Coordinated Universal Time).pdf",
    //             "thumbnailImage": "https://storage.googleapis.com/adot_bucket_prod/Adot/reference/thumbnail/Mon Jan 20 2025 18:03:28 GMT+0000 (Coordinated Universal Time).pdf",
    //             "archived": false,
    //             "createdAt": "2025-01-20T18:03:28.727Z",
    //             "updatedAt": "2025-01-20T18:03:28.727Z",
    //             "__v": 0
    //         },
    //         {
    //             "_id": "678e8ffb4f2562f3ca4523cf",
    //             "title": "new title",
    //             "description": "new description",
    //             "document": "https://storage.googleapis.com/adot_bucket_prod/Adot/reference/doc/Mon Jan 20 2025 18:03:38 GMT+0000 (Coordinated Universal Time).pdf",
    //             "thumbnailImage": "https://storage.googleapis.com/adot_bucket_prod/Adot/reference/thumbnail/Mon Jan 20 2025 18:03:39 GMT+0000 (Coordinated Universal Time).pdf",
    //             "archived": false,
    //             "createdAt": "2025-01-20T18:03:39.808Z",
    //             "updatedAt": "2025-01-20T18:03:39.808Z",
    //             "__v": 0
    //         },
//         {
//             "_id": "678e90014f2562f3ca4523d3",
//             "title": "new title",
//             "description": "new description",
//             "document": "https://storage.googleapis.com/adot_bucket_prod/Adot/reference/doc/Mon Jan 20 2025 18:03:44 GMT+0000 (Coordinated Universal Time).pdf",
//             "thumbnailImage": "https://storage.googleapis.com/adot_bucket_prod/Adot/reference/thumbnail/Mon Jan 20 2025 18:03:45 GMT+0000 (Coordinated Universal Time).pdf",
//             "archived": false,
//             "createdAt": "2025-01-20T18:03:45.765Z",
//             "updatedAt": "2025-01-20T18:03:45.766Z",
//             "__v": 0
//         },
//         {
//             "_id": "678e90054f2562f3ca4523d7",
//             "title": "new title",
//             "description": "new description",
//             "document": "https://storage.googleapis.com/adot_bucket_prod/Adot/reference/doc/Mon Jan 20 2025 18:03:49 GMT+0000 (Coordinated Universal Time).pdf",
//             "thumbnailImage": "https://storage.googleapis.com/adot_bucket_prod/Adot/reference/thumbnail/Mon Jan 20 2025 18:03:49 GMT+0000 (Coordinated Universal Time).pdf",
//             "archived": false,
//             "createdAt": "2025-01-20T18:03:49.934Z",
//             "updatedAt": "2025-01-20T18:03:49.934Z",
//             "__v": 0
//         }
//     ]
// }


