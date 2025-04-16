import {
  useArchiveInsightMutation,
  useUnarchiveInsightMutation,
} from "@/api/insight-api";
import { useGetAllTopicsQuery } from "@/api/topic-api";
import { Insight } from "@/types/insight";
import { Topic } from "@/types/topic";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Accordion,
  AccordionItem,
  Skeleton,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, Key, useCallback, useMemo, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import TurndownService from "turndown";

interface InsightTableProps {
  isSplitView: boolean;
  page: number;
  insights: Insight[];
  router: any;
  count: number;
  onPageChange: Function;
  onPreviousPage: any;
  onNextPage: any;
  pages: number;
  insightFilters: {
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
  page: number;
  insights: Insight[];
  router: any;
  count: number;
  onPageChange: Function;
  onPreviousPage: any;
  onNextPage: any;
  pages: number;
  insightFilters: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
    isArchived: boolean | string;
  };
  sortTable: Function;
  loading: boolean;
}

export const InsightTable: FC<InsightTableProps> = ({
  isSplitView,
  page,
  insights,
  router,
  count,
  onPageChange,
  onPreviousPage,
  onNextPage,
  pages,
  insightFilters,
  sortTable,
  loading,
}) => {
  return (
    <>
      {isSplitView ? (
        <SplitTableView />
      ) : (
        <FullViewTable
          page={page}
          insights={insights}
          router={router}
          count={count}
          onPageChange={onPageChange}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          pages={pages}
          insightFilters={insightFilters}
          sortTable={sortTable}
          loading={loading}
        />
      )}
    </>
  );
};

export const FullViewTable: FC<FullViewTableProps> = ({
  page,
  insights,
  router,
  count,
  onPageChange,
  onPreviousPage,
  onNextPage,
  pages,
  insightFilters,
  sortTable,
  loading,
}) => {
  const tableHeads = [
    { name: "Rank", uid: "rank", sortable: true },
    { name: "", uid: "image", sortable: false },
    { name: "Title", uid: "title", sortable: true },
    { name: "Date", uid: "date", sortable: true },
    { name: "Actions", uid: "actions", sortable: false },
  ];

  const [archiveInsight] = useArchiveInsightMutation();
  const [unarchiveInsight] = useUnarchiveInsightMutation();
  const turndownService = new TurndownService();
  const convertHtmlToMarkdown = (htmlContent: any) => {
    return turndownService.turndown(htmlContent);
  };

  const handleUnArchiveInsight = (id: string) => {
    unarchiveInsight({ id });
  };

  const handleArchiveInsight = (id: string) => {
    archiveInsight({ id });
  };

  const t: Insight = {
    title: "",
    stage: 1,
    status: true,
    archived: false,
    _id: "",
    topic: "",
    rank: 1,
    category: "",
    createdAt: "",
    updatedAt: "",
    trimesters:[],
    pregnancyWeeks:[],
    thumbnailImage: "",
    versions: [],
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

  const renderCell = (isInsight: boolean, insight: Insight, columnKey: Key) => {
    switch (columnKey) {
      case "rank":
        return (
          <>
            {isInsight ? (
              <div className="text-s text-title">
                <Link href={`/insights/${insight?._id}`}>{insight?.rank}</Link>
              </div>
            ) : (
              <Skeleton className="h-5 mb-2 w-8 rounded-xl" />
            )}
          </>
        );
      case "title":
        return (
          <>
            {isInsight ? (
              <Link href={`/insights/${insight?._id}`}>
                <div className="text-s text-title font-light w-3/4 overflow-hidden">
                  {insight && insight?.versions && (
                    <ReactMarkdown>
                      {convertHtmlToMarkdown(insight?.versions[0]?.title)}
                    </ReactMarkdown>
                  )}
                  {insight && insight?.versions?.length > 1 ? (
                    <div className="mt-2 text-s">
                      <ReactMarkdown>
                        {convertHtmlToMarkdown(insight?.versions[1]?.title)}
                      </ReactMarkdown>
                    </div>
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
            {isInsight ? (
              <>
                {insight?.thumbnailImage ? (
                  <Link href={`/insights/${insight?._id}`}>
                    <div className="bg-gray-200 rounded-full w-[55px] h-[55px] border border-primary border-4">

                      <Image
                        src={insight?.thumbnailImage}
                        alt="Profile"
                        width={50}
                        height={50}
                        className="rounded-full w-[50px] h-[50px]"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="text-s h-10 w-10 bg-gray-200 rounded-sm"></div>
                )}
              </>
            ) : (
              <Skeleton className="h-10 w-10 rounded-md" />
            )}
          </>
        );
      case "date":
        const formattedDate = formatDate(insight.updatedAt);
        const formattedTime = formatTime(insight.updatedAt);
        return (
          <>
            {isInsight ? (
              <Link href={`/insights/${insight?._id}`}>
                <div className="text-[14px] mt-1">{formattedDate}</div>
                <div className="text-[12px] mt-2">{formattedTime}</div>
              </Link>
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
              {isInsight ? (
                <div className="flex">
                  <Link href={`insights/edit-insight/${insight?._id}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      color="#AE709F"
                      viewBox="0 0 25 25"
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
                      insight?.archived
                        ? handleUnArchiveInsight(insight._id)
                        : handleArchiveInsight(insight._id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      color={insight?.archived ? "#41e841" : "#FF3B30"}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className={`w-8 h-8 mx-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg active:scale-95 active:shadow-md ${
                        insight?.archived ? "bg-[#5cff5c]" : "bg-[#FF3B30]"
                      } bg-opacity-20 p-2 shadow-md`}
                    >
                      <path
                        strokeLinecap="round"
                        d={
                          insight?.archived
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
          {count} insights in total
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={insightFilters.page}
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
  }, [page, pages, onNextPage, onPageChange, onPreviousPage, count]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
        sortDescriptor={{
          column: insightFilters.sortBy,
          direction:
            insightFilters.sortOrder == "asc" ? "ascending" : "descending",
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
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className="text-[14px] bg-gray-200"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        {loading ? (
          <TableBody>
            {shimmers.map((shimmer, i) => (
              <TableRow key={i} >
                {(columnKey) => (
                  <TableCell className="px-4 py-2 border-b border-gray-200">{renderCell(false, shimmer, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {insights?.map((insight) => (
              <TableRow key={insight?._id} className="hover:bg-gray-100 transition-colors">
                {(columnKey) => (
                  <TableCell className="px-3 py-[.4rem] border-b border-gray-200">{renderCell(true, insight, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
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

  const [archiveInsight] = useArchiveInsightMutation();
  const [unarchiveInsight] = useUnarchiveInsightMutation();
  const turndownService = new TurndownService();
  const convertHtmlToMarkdown = (htmlContent: any) => {
    return turndownService.turndown(htmlContent);
  };

  const handleArchiveInsight = (id: string) => {
    archiveInsight({ id });
  };

  const handleUnArchiveInsight = (id: string) => {
    unarchiveInsight({ id });
  };

  const deleteTopic = (_id: string) => {
    setuserId(_id);
    setOpen(true);
  };

  const { data: res, isFetching, isError, isSuccess } = useGetAllTopicsQuery();
  let topics: Topic[] = [];

  if (isSuccess) {
    topics = res.data;
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

  const renderCell = (insight: Insight, columnKey: Key) => {
    switch (columnKey) {
      case "title":
        return (
          <Link href={`/insights/${insight?._id}`}>
            <div className="text-xs text-title font-light">
              {insight && insight?.versions && insight?.versions[0]?.title}
              {insight && insight?.versions?.length > 1 ? (
                <div className="mt-2 text-xs">
                  <ReactMarkdown>
                    {convertHtmlToMarkdown(insight?.versions[1]?.title)}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="mt-2 text-xs">እርግዝና ትሪሚስተር</div>
              )}
            </div>
          </Link>
        );
      case "image":
        return (
          <>
            {insight?.thumbnailImage ? (
              <Link href={`/insights/${insight?._id}`}>
                <div className="bg-gray-200 rounded-sm w-fit h-fit">
                  <Image
                    src={insight?.thumbnailImage}
                    alt="Profile"
                    width={50}
                    height={50}
                    className="w-10 h-10 rounded-sm"
                  />
                </div>
              </Link>
            ) : (
              <div className="text-xs h-10 w-10 bg-gray-200 rounded-sm"></div>
            )}
          </>
        );

      case "date":
        const formattedDate = formatDate(insight.updatedAt);
        const formattedTime = formatTime(insight.updatedAt);
        return (
          <Link href={`/insights/${insight._id}`}>
            <>
              <div className="text-xs mt-1">
                {formattedDate !== "Invalid Date"
                  ? formattedDate
                  : "Dec 27, 2024"}
              </div>
              <div className="text-xs mt-1">
                {formattedTime !== undefined ? formattedTime : "12:56"}
              </div>
            </>
          </Link>
        );
      case "actions":
        return (
          <div className="flex">
            <Link href={`insights/edit-insight/${insight?._id}`}>
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
              onClick={() => {
                insight?.archived
                  ? handleUnArchiveInsight(insight?._id)
                  : handleArchiveInsight(insight?._id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                color={insight?.archived ? "#41e841" : "#FF3B30"}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-8 h-8 mx-2 rounded-full ${
                  insight?.archived ? "bg-[#5cff5c]" : "bg-[#FF3B30]"
                } bg-opacity-20 p-2`}
              >
                <path
                  strokeLinecap="round"
                  d={
                    insight.archived
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
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        {topics &&
          topics.map((topic: any, i: number) => (
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
                    {i + 1}.{topic?.versions[0]?.title}
                  </span>
                }
              >
                <div className="flex pl-8 mb-7 min-w-full h-9">
                  <Link
                    href={`/topic/add-topic/${topic?._id}`}
                    className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-full flex items-center ml-auto"
                  >
                    <IoAddOutline className="mr-4 h-4 w-4" />
                    Add Topic
                  </Link>
                </div>
                <>
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
                        isLoading={topic?.insights?.length === 0}
                        loadingContent={"Loading content"}
                      >
                        {topic?.insights?.map((item: Insight) => (
                          <TableRow key={item?._id}>
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

export default InsightTable;