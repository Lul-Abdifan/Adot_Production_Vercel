import {
  useGetInsightQuery,
  useApproveInsightMutation,
} from "@/api/insight-api";
import { AddCategoryDialog } from "@/components/common/ApproveDialogueBox";
import SearchBar from "@/components/common/SearchBar";
import RootLayout from "@/layouts/RootLayout";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Chip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import TurndownService from "turndown";

function SingleInsight() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isSuccess } = useGetInsightQuery(id as string);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const turndownService = new TurndownService();

  // Use the approveInsight mutation
  const [approveInsight] = useApproveInsightMutation();

  const handleApproveClick = () => {
    setIsDialogOpen(true); // Open the dialog
  };

  const handleDialogConfirm = async () => {
    try {
      await approveInsight({ id: id as string }).unwrap();
      setIsApproved(true); // This should trigger the re-render and change the button
    } catch (error) {
      console.error("Failed to approve insight:", error);
    } finally {
      setIsDialogOpen(false); // Close the dialog
    }
  };



  const insight = data?.data?.insight

  // Convert HTML content to Markdown
  const convertHtmlToMarkdown = (htmlContent: any) => {
    return turndownService.turndown(htmlContent);
  };

  return (
    <RootLayout>
      {isSuccess && (
        <div className="mx-16 my-6 h-full">
          <SearchBar text={"insights"} />
          <div className="bg-white my-6 h-full rounded-2xl shadow-2xl pb-24 overflow-auto relative">
            <div className="flex">
              {!isApproved ? (
                <button
                  onClick={handleApproveClick}
                  className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl items-center mt-10 ml-auto mr-40"
                  disabled={isApproved}
                >
                  <span className="text-xs">Approve</span>
                </button>
              ) : (
                <div className="bg-green-500 text-white font-medium text-xs px-4 py-2 rounded-2xl mt-10 ml-auto mr-40 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  <span className="text-xs">Verified</span>
                </div>
              )}

              <Link
                className="absolute top-10 right-11 z-10"
                href={`/insights/edit-insight/${insight?._id}`}
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
              <div className="h-28 w-full mt-12 mb-10 rounded-xl bg-[#EBD7E7] bg-opacity-40 px-14 relative flex items-center">
                <div className="mt-16">
                  <Image
                    src={insight?.thumbnailImage ?? ""}
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
                        <ReactMarkdown>
                          {convertHtmlToMarkdown(insight?.versions[0].title)}
                        </ReactMarkdown>
                      </div>
                      <div>
                        <ReactMarkdown>
                          {convertHtmlToMarkdown(insight?.versions[1].title)}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-6">
                      {!insight?.archived && (
                        <Chip
                          className="capitalize px-2"
                          color={"success"}
                          size="md"
                          variant="flat"
                        >
                          Active
                        </Chip>
                      )}
                      {insight?.archived && (
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
                  <span className="text-tableTitle font-bold">Topic: </span> A
                  pre-pregnancy Planning
                </div>
                <div className="sm:flex flex-none gap-10">
                  <div className="w-3/4">
                    <div className="text-tableTitle font-bold my-4">
                      Description
                    </div>
                    <div className="text-[#4C4C4C] text-sm">
                      <ReactMarkdown>
                        {convertHtmlToMarkdown(insight?.versions[0].content)}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="w-3/4">
                    <div className="text-tableTitle font-bold my-4">
                      Description
                    </div>
                    <div className="text-[#4C4C4C] text-sm">
                      <ReactMarkdown>
                        {convertHtmlToMarkdown(insight?.versions[1].content)}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add the dialog component */}
      {isDialogOpen && (
        <AddCategoryDialog
          setOpen={setIsDialogOpen}
          onConfirm={handleDialogConfirm} // Pass the correct onConfirm prop
        />
      )}
    </RootLayout>
  );

  return <div>Loading...</div>;
}

export default SingleInsight;
