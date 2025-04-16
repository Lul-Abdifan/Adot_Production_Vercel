import { useGetCategoryByIdQuery } from "@/api/category-api";
import { useGetTopicByIdQuery, useApproveTopicMutation } from "@/api/topic-api";
import AddCategoryDialog from "@/components/common/ApproveDialogueBox";
import SearchBar from "@/components/common/SearchBar";
import RootLayout from "@/layouts/RootLayout";
import { Category } from "@/types/category";
import { Insight } from "@/types/insight";
import { Topic } from "@/types/topic";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Chip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

function SingleTopic() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: topicData,
    isSuccess: topicSuccess,
    isLoading: topicLoading,
    isFetching: topicFetching,
  } = useGetTopicByIdQuery(id as string);

  const categoryID = topicData
    ? topicData?.data.category
    : "652eed1e12557e233c692110";
  const { data: categoryData } = useGetCategoryByIdQuery(categoryID);

  const [approveTopic] = useApproveTopicMutation(); // Add the mutation
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Handle dialog confirmation and close dialog
  const handleDialogConfirm = async () => {
    try {
      await approveTopic({ id: id as string }).unwrap();
      setIsApproved(true);
    } catch (error) {
      // Handle any errors
      console.error("Failed to approve topic:", error);
    }
    setIsDialogOpen(false);
  };

    const topic: Topic = topicData?.data as Topic;
    const category = categoryData?.data;

    return (
      <RootLayout>
        {
          (topicSuccess && (
            <div className="mx-16 my-6 h-full">
              <SearchBar text={"topics"} />
x
              <div className="bg-white my-6 h-full rounded-2xl shadow-2xl pb-32 overflow-auto relative">
                <div className="flex">
                  {!isApproved ? (
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl items-center mt-8 ml-auto mr-40"
                      disabled={isApproved}
                    >
                      <span className="text-xs">Approve</span>
                    </button>
                  ) : (
                    <div className="bg-green-500 text-white font-medium text-xs px-4 py-2 rounded-2xl items-center mt-8 ml-auto mr-40 flex items-center">
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      <span className="text-xs">Verified</span>
                    </div>
                  )}
                  <Link
                    href={`/topic/edit-topic/${topic._id}`}
                    className="absolute top-8 right-11 z-10"
                  >
                    {/* Edit Button */}
                  </Link>

                  {/* Approval Dialog */}
                  {isDialogOpen && (
                    <AddCategoryDialog
                      setOpen={setIsDialogOpen}
                      onConfirm={handleDialogConfirm}
                    />
                  )}
                  <Link
                    href={`/topic/edit-topic/${topic._id}`}
                    className="absolute top-8 right-11 z-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      color="#AE709F"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-9 h-9 mx-2 rounded-full bg-[#AE709F] bg-opacity-20 p-2"
                    >
                      <path
                        strokeLinecap="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="relative p-12">
                  {/* Content of the SingleTopic page */}
                  <div className="h-28 w-full mt-12 mb-10 rounded-xl bg-[#EBD7E7] bg-opacity-40 px-14 relative flex items-center">
                    <div className="mt-16">
                      <Image
                        src={topic.thumbnailImage}
                        alt="Profile"
                        width={200}
                        height={150}
                        className="rounded-lg h-50 w-50 absolute top-1/2 left-36 transform -translate-x-1/2 -translate-y-1/2"
                      />
                    </div>

                    <div className="w-full sm:pl-[25%]" id="title-container">
                      <div
                        className="sm:ml-8 sm:flex text-primary justify-between"
                        id="title"
                      >
                        <div className="flex-shrink-0">
                          <div className="font-semibold">
                            {topic.versions[0].title}
                          </div>
                          <div> {topic.versions[1].title}</div>
                        </div>
                        <div className="flex-shrink-0 ml-6">
                          {!topic.archived && (
                            <Chip
                              className="capitalize px-2"
                              color={"success"}
                              size="md"
                              variant="flat"
                            >
                              Active
                            </Chip>
                          )}

                          {topic.archived && (
                            <Chip
                              className="capitalize px-2"
                              color={"danger"}
                              size="md"
                              variant="flat"
                            >
                              Archived
                            </Chip>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-8">
                    <div className="text-tableTitle mt-24 mb-6">
                      <span className="text-tableTitle font-bold">
                        Category:{" "}
                      </span>{" "}
                      {category?.versions[0].title}
                    </div>
                    <div className="sm:flex flex-none gap-10">
                      <div className="w-3/4">
                        <div className="text-tableTitle font-bold my-4">
                          Description
                        </div>
                        <div className=" text-[#4C4C4C] text-sm">
                          {topic.versions[0].description}
                        </div>
                      </div>

                      <div className="w-3/4">
                        <div className="text-tableTitle font-bold my-4 ">
                          መግለጫ
                        </div>
                        <div className="text-[#4C4C4C] text-sm">
                          {topic.versions[1].description}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-20 mr-10 text-sm ">
                    <div className="text-tableTitle font-bold">
                      Covered Insights
                    </div>

                    {topic.insights.map((insight: Insight) => (
                      <div
                        key={insight._id}
                        className="flex justify-between items-center bg-bgTile p-4 my-4 rounded-lg"
                      >
                        <div className="flex items-center flex-grow">
                          <div className="w-1/4 h-full">
                            <Image
                              src={insight.thumbnailImage}
                              width={100}
                              height={100}
                              alt="Profile"
                              className="rounded-lg"
                            />
                          </div>
                          <div className="w-1/4 h-full text-tableTitle">
                            <div className="text-[#4C4C4C] font-medium">
                              {insight.title}
                            </div>
                            <div>{insight.versions[0].title}</div>
                          </div>
                          <div className="w-1/4 h-full ml-10 text-tableTitle">
                            <div className="ml-12">
                              Stage:{" "}
                              <span className="font-bold text-[#4C4C4C]">
                                {insight.stage}
                              </span>
                            </div>
                          </div>
                          <div className="w-1/4 h-full ml-10">
                            <Chip
                              className="capitalize px-2"
                              color={insight.archived ? "success" : "danger"}
                              size="md"
                              variant="flat"
                            >
                              {insight.archived ? "Active" : "Archived"}
                            </Chip>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Approval Dialog */}
              {isDialogOpen && (
                <AddCategoryDialog
                  setOpen={setIsDialogOpen}
                  onConfirm={handleDialogConfirm}
                />
              )}
            </div>
          ))}
      </RootLayout>
    );
  

  return <div>No Data</div>;
}

export default SingleTopic;
