"use client";

import { useGetAllCategoriesQuery } from "@/api/category-api";
import {
  useArchiveTopicMutation,
  useUnarchiveTopicMutation,
} from "@/api/topic-api";
import { Category } from "@/types/category";
import { Topic } from "@/types/topic";
import Link from "next/link";
import React, { FC, Key, useMemo, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import Image from "next/image";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Accordion,
  AccordionItem,
  Skeleton,
} from "@nextui-org/react";
import DeleteDialog from "./DeleteDialog";
import { useRouter } from "next/router";

interface TopicTableProps {
  isSplitView: boolean;
  topics: Topic[];
  router: any;
  count: number;
  onPageChange: Function;
  onPreviousPage: any;
  onNextPage: any;
  pages: number;
  topicFilters: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
    isArchived: boolean | string;
  };
  sortTable: Function;
  loading: boolean;
}

interface FullViewTableProps {
  topics: Topic[];
  router: any;
  count: number;
  onPageChange: Function;
  onPreviousPage: any;
  onNextPage: any;
  pages: number;
  topicFilters: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
    isArchived: boolean | string;
  };
  sortTable: Function;
  loading: boolean;
}

const tableHeads = [
  { name: "Rank", uid: "rank", sortable: true },
  { name: "", uid: "image", sortable: false },
  { name: "Title", uid: "title", sortable: true },
  { name: "Insights", uid: "insights", sortable: false },
  { name: "Date", uid: "date", sortable: true },
  { name: "Actions", uid: "actions", sortable: false },
];

export const TopicTable: FC<TopicTableProps> = ({
  isSplitView,
  topics,
  router,
  count,
  onPageChange,
  onPreviousPage,
  onNextPage,
  pages,
  topicFilters,
  sortTable,
  loading,
}) => {
  return (
    <>
      {isSplitView ? (
        <SplitTableView />
      ) : (
        <FullViewTable
          topics={topics}
          router={router}
          count={count}
          onPageChange={onPageChange}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          pages={pages}
          topicFilters={topicFilters}
          sortTable={sortTable}
          loading={loading}
        />
      )}
    </>
  );
};

export const FullViewTable: FC<FullViewTableProps> = ({
  topics,
  router,
  count,
  onPageChange,
  onPreviousPage,
  onNextPage,
  pages,
  topicFilters,
  sortTable,
  loading,
}) => {
  const [open, setOpen] = useState(false);
  const [topicId, setTopicId] = useState("");
  const [archiveTopic] = useArchiveTopicMutation();
  const [unarchiveTopic] = useUnarchiveTopicMutation();

  const handleArchiveTopic = (id: string) => {
    archiveTopic({ id });
  };

  const handleUnArchiveTopic = (id: string) => {
    unarchiveTopic({ id });
  };

  const t: Topic = {
    _id: "",
    category: "",
    rank: "1",
    insights: [],
    createdAt: "",
    updatedAt: "",
    thumbnailImage: "",
    versions: [],
    archived: false,
  };

  const shimmers = [t, t, t, t, t];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };
    const dateObject = new Date(dateString);
    const time = dateObject.toLocaleDateString("en-US", options).split(",");
    return time[1];
  };

  const renderCell = (isTopic: boolean, topic: Topic, columnKey: Key) => {
    switch (columnKey) {
      case "rank":
        return (
          <>
            {isTopic ? (
              <div className="text-s text-title ">{topic.rank}</div>
            ) : (
              <Skeleton className="h-5 mb-2 w-8 rounded-xl" />
            )}
          </>
        );
      case "title":
        return (
          <>
            {isTopic ? (
              <Link href={`topic/${topic._id}`}>
                <div className="text-s text-title w-full font-light">
                  {topic && topic.versions && topic.versions[0].title}
                  {topic && topic.versions.length > 1 ? (
                    <div className="mt-2 text-s">{topic.versions[1].title}</div>
                  ) : (
                    <div className="mt-2 text-s">እርግዝና ትሪሚስተር</div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="mr-32 w-full">
                <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                <Skeleton className="h-3 my- w-3/5 rounded-full" />
              </div>
            )}
          </>
        );
      case "image":
        return (
          <>
            {isTopic ? (
              <>
                {topic.thumbnailImage ? (
                  <Link href={`topic/${topic._id}`}>
                    <div className="bg-gray-200 rounded-full w-[55px] h-[55px] border border-primary border-4">
                      <Image
                        src={topic.thumbnailImage}
                        alt="Profile"
                        width={50}
                        height={50}
                        className="rounded-full w-[50px] h-[50px]"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="text-xs h-10 w-10 bg-gray-200 rounded-sm"></div>
                )}
              </>
            ) : (
              <Skeleton className="h-10 w-10 rounded-md" />
            )}
          </>
        );
      case "insights":
        return (
          <>
            {isTopic ? (
              <div>
                <Dropdown closeOnSelect={false}>
                  {/* solid | bordered | light | flat | faded | shadow */}
                  <DropdownTrigger>
                    <Button
                      className="text-gray-700 bg-gray-200"
                      variant="light"
                      radius="full"
                    >
                      {`Covers ${topic.insights.length} insights`}{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    className="text-secondary"
                    aria-label="Static Actions"
                  >
                    {topic.insights.map((insight) => (
                      <DropdownItem
                        onClick={() => router.push(`/insights/${insight._id}`)}
                        key={insight._id}
                      >
                        {" "}
                        {insight.versions[0].title}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <Skeleton className="h-8 w-4/5 mr-24 rounded-full" />
            )}
          </>
        );
      case "date":
        const formattedDate = formatDate(topic.updatedAt);
        const formattedTime = formatTime(topic.updatedAt);
        return (
          <>
            {isTopic ? (
              <>
                <div className="text-xs mt-1 w-fit ">{formattedDate}</div>
                <div className="text-s mt-1">{formattedTime}</div>
              </>
            ) : (
              <div className="w-full mr-16">
                <Skeleton className="h-3 mb-2 w-3/5 rounded-full" />
                <Skeleton className="h-3 my- w-2/5 rounded-full" />
              </div>
            )}
          </>
        );
      case "actions":
        return (
          <>
            {isTopic ? (
              <div className="flex">
                <Link href={`topic/edit-topic/${topic._id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    color="#AE709F"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 mx-2 rounded-full bg-[#AE709F] bg-opacity-20 p-2 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg hover:bg-opacity-30 active:scale-95 active:shadow-md shadow-md"
                  >
                    <path
                      strokeLinecap="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </Link>

                <button
                  onClick={() => {
                    topic.archived
                      ? handleUnArchiveTopic(topic._id)
                      : handleArchiveTopic(topic._id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    color={topic.archived ? "#41e841" : "#FF3B30"}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className={`w-8 h-8 mx-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg active:scale-95 active:shadow-md ${
                      topic.archived ? "bg-[#5cff5c]" : "bg-[#FF3B30]"
                    } bg-opacity-20 p-2`}
                  >
                    <path
                      strokeLinecap="round"
                      d={
                        topic.archived
                          ? "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                          : "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      }
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="flex w-fit">
                  <Skeleton className="h-8 w-8 mr-5 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </>
            )}
          </>
        );
      default:
        return <div></div>;
    }
  };

  const bottomContent = useMemo(() => {
    return (
      <div className="pt-4 bg-white rounded-2xl px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {count} topics in total
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={topicFilters.page}
          total={pages}
          onChange={(e) => onPageChange(e)}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [pages, onNextPage, onPageChange, onPreviousPage, count]);

  return (
    <>
      {open && <DeleteDialog _id={topicId} setOpen={setOpen} />}
      <div className="p-6 bg-white rounded-2xl shadow-sm">
        <Table
          aria-label="Example table with custom cells, pagination and sorting"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="inside"
          sortDescriptor={{
            column: topicFilters.sortBy,
            direction:
              topicFilters.sortOrder == "asc" ? "ascending" : "descending",
          }}
          onSortChange={(e) => sortTable(e)}
          topContentPlacement="outside"
          removeWrapper={true}
          className="text-secondary w-full h-full"
        >
          <TableHeader columns={tableHeads}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={"center"}
                allowsSorting={column.sortable}
                className="text-[14px] bg-gray-200"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          {loading ? (
            <TableBody>
              {shimmers.map((topic, i) => (
                <TableRow key={i}>
                  {(columnKey) => (
                    <TableCell>{renderCell(false, topic, columnKey)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {topics.map((topic) => (
                <TableRow
                  key={topic._id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  {(columnKey) => (
                    <TableCell className="px-4 py-[.4rem] border-b border-gray-200">
                      {renderCell(true, topic, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </>
  );
};

function SplitTableView() {
  const tableHeads = [
    { name: "", uid: "image", sortable: false },
    { name: "Title", uid: "title", sortable: false },
    { name: "Date", uid: "date", sortable: false },
    { name: "Actions", uid: "actions", sortable: false },
  ];

  const [open, setOpen] = useState(false);
  const [userId, setuserId] = useState("");
  const router = useRouter();

  const [archiveTopic] = useArchiveTopicMutation();
  const [unarchiveTopic] = useUnarchiveTopicMutation();

  const handleArchiveTopic = (id: string) => {
    archiveTopic({ id });
  };

  const handleUnArchiveTopic = (id: string) => {
    unarchiveTopic({ id });
  };

  const deleteTopic = (_id: string) => {
    setuserId(_id);
    setOpen(true);
  };

  const {
    data: res,
    isFetching,
    isError,
    isSuccess,
  } = useGetAllCategoriesQuery();

  let categories: Category[] = [];

  if (isSuccess) {
    categories = res.data;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };
    const dateObject = new Date(dateString);
    const time = dateObject.toLocaleDateString("en-US", options).split(",");
    return time[1];
  };

  const renderCell = (topic: Topic, columnKey: Key) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="text-xs text-title font-light">
            {topic && topic.versions && topic.versions[0].title}
            {topic && topic.versions.length > 1 ? (
              <div className="mt-2 text-xs">{topic.versions[1].title}</div>
            ) : (
              <div className="mt-2 text-xs">እርግዝና ትሪሚስተር</div>
            )}
          </div>
        );
      case "image":
        return (
          <>
            {topic.thumbnailImage ? (
              <div className="bg-gray-200 rounded-sm w-fit h-fit">
                <Image
                  src={topic.thumbnailImage}
                  alt="Profile"
                  width={50}
                  height={50}
                  className="w-10 h-10 rounded-sm"
                />
              </div>
            ) : (
              <div className="text-xs h-10 w-10 bg-gray-200 rounded-sm"></div>
            )}
          </>
        );

      case "date":
        const formattedDate = formatDate(topic.updatedAt);
        const formattedTime = formatTime(topic.updatedAt);
        return (
          <>
            <div className="text-xs mt-1">
              {formattedDate != "Invalid Date" ? formattedDate : "Dec 27, 2024"}
            </div>
            <div className="text-xs mt-1">
              {formattedTime != undefined ? formattedTime : "12:56"}
            </div>
          </>
        );
      case "actions":
        return (
          <div className="flex">
            <Link href={`topic/edit-topic/${topic._id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                color="#AE709F"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8 mx-2 rounded-full bg-[#AE709F] bg-opacity-20 p-2"
              >
                <path
                  strokeLinecap="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </Link>

            <button
              onClick={
                topic.archived
                  ? handleUnArchiveTopic.bind(null, topic._id)
                  : handleArchiveTopic.bind(null, topic._id)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                color={topic.archived ? "#41e841" : "#FF3B30"}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-8 h-8 mx-2 rounded-full ${
                  topic.archived ? "bg-[#5cff5c]" : "bg-[#FF3B30]"
                } bg-opacity-20 p-2`}
              >
                <path
                  strokeLinecap="round"
                  d={
                    topic.archived
                      ? "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                      : "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  }
                />
              </svg>
            </button>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {open && <DeleteDialog _id={userId} setOpen={setOpen} />}
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        {categories &&
          categories.map((category: any, i: number) => (
            <Accordion
              variant="splitted"
              key={i}
              className="inline-block min-w-full py-2 align-middle text-xs"
              selectionMode={"single"}
            >
              <AccordionItem
                key="1"
                aria-label="Accordion 1"
                title={
                  <span className="text-gray-500 px-3 text-sm font-semibold leading-9">
                    {i + 1}. {category.versions[0].title}
                  </span>
                }
              >
                <div className="flex pl-8 mb-7 min-w-full h-9">
                  <Link
                    href={`/topic/add-topic/${category._id}`}
                    className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-full flex items-center ml-auto"
                  >
                    <IoAddOutline className="mr-4 h-4 w-4" />
                    Add Topic
                  </Link>
                </div>
                <>
                  {open && <DeleteDialog _id={userId} setOpen={setOpen} />}
                  <div className="pb-2 bg-white rounded-2xl">
                    <Table
                      aria-label="Example table with custom cells, pagination and sorting"
                      removeWrapper={true}
                      className="text-secondary w-full h-full"
                    >
                      <TableHeader columns={tableHeads}>
                        {(column) => (
                          <TableColumn
                            key={column.uid}
                            align={
                              column.uid === "actions" ? "center" : "start"
                            }
                            allowsSorting={column.sortable}
                          >
                            {column.name}
                          </TableColumn>
                        )}
                      </TableHeader>
                      <TableBody
                        isLoading={category.topics.length == 0}
                        loadingContent={"Loading content"}
                      >
                        {category.topics.map((item: Topic) => (
                          <TableRow key={item._id}>
                            {(columnKey) => (
                              <TableCell>
                                {renderCell(item, columnKey)}
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              </AccordionItem>
            </Accordion>
          ))}
      </div>
    </div>
  );
}

export default TopicTable;
