import { useArchiveCategoryMutation, useGetAllCategoriesQuery, useGetSortedCategoriesQuery, useUnarchiveCategoryMutation } from "@/api/category-api";
import { useApproveCategoryMutation } from "@/api/category-api";
import { Category, Version } from "@/types/category";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useRouter } from "next/router";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";


interface CategoryTableProps {
  setOpen: Function;
  setSelectedCategory: Function;
  loading: boolean;
  setLoading: Function;
  setCategories: Function;
  refetch: Function;
  pages: number;
  categoryFilters: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
    isArchived: boolean | string;
  };
  setCategoryFilters: Function;
  count: number;
  categories: Category[];
  onPageChange: Function;
  onPreviousPage: any;
  onNextPage: any;
  sortTable: Function;
}
const defaultVersion: Version = {
  language: "",
  title: "",
  description: "",
  _id: undefined,
};
const CategoryTable: React.FC<CategoryTableProps> = ({
  setOpen,
  setSelectedCategory,
  loading,
  categoryFilters,
  pages,
  count,
  categories,
  onPageChange,
  onPreviousPage,
  onNextPage,
  sortTable,
  refetch,
}) => {
  const [archiveCategory] = useArchiveCategoryMutation();
  const [unarchiveCategory] = useUnarchiveCategoryMutation();
  const [approveCategory] = useApproveCategoryMutation();

  const handleEditCategory = useCallback(
    (category: Category) => {
      setSelectedCategory(category);
      setOpen(true);
    },
    [setOpen, setSelectedCategory]
  );

  const handleArchiveCategory = (id: string) => {
    archiveCategory({ id });
    refetch();
  };

  const handleUnArchiveCategory = (id: string) => {
    unarchiveCategory({ id });
    refetch();
  };
  const tHeads = [
    { name: "Rank", uid: "rank", sortable: true },
    { name: "Title", uid: "title", sortable: true },
    { name: "Topics", uid: "topics", sortable: false },
    { name: "Date", uid: "date", sortable: true },
    { name: "Actions", uid: "actions", sortable: false },
  ];

  const router = useRouter();

  const t: Category = {
    _id: "",
    versions:[],
    rank: 1,
    topics: [],
    createdAt: "",
    updatedAt: "",
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
  const [approvedCategories, setApprovedCategories] = useState<string[]>([]);
  const handleApprove = (categoryId: string) => {
    approveCategory({ id: categoryId })
      .unwrap()
      .then(() => {
        setApprovedCategories((prev) => [...prev, categoryId]);
        // Optionally, you can refetch or show a success message
        refetch();
      })
      .catch(() => {
        console.error("Error approving category: ");
      });
  };

  const isApproved = (categoryId: string) =>
    approvedCategories.includes(categoryId);

  const renderCell = useCallback(
    (isCategory: boolean, category: Category, columnKey: Key) => {
      switch (columnKey) {
        case "rank":
          return (
            <>
              {isCategory ? (
                <div className="text-s text-title ml-3">{category.rank}</div>
              ) : (
                <Skeleton className="h-5 mb-2 w-8 rounded-xl" />
              )}
            </>
          );
        case "title":
          return (
            <>
              {isCategory ? (
                <div className="text-s text-title font-light w-45">
                  {category && category.versions && category.versions[0].title}
                  {category && category.versions ? (
                    <div className="mt-2 text-s mx-0 px-0">
                      {category.versions[0].title}
                    </div>
                  ) : (
                    <div className="mt-2 text-s mx-0 px-0">እርግዝና ትሪሚስተር</div>
                  )}
                </div>
              ) : (
                <div className="mr-32 w-full">
                  <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                  <Skeleton className="h-3 my- w-3/5 rounded-full" />
                </div>
              )}
            </>
          );
        case "topics":
          return (
            <>
              {isCategory ? (
                <div className="m-0 p-0">
                  <Dropdown closeOnSelect={false}>
                    {/* solid | bordered | light | flat | faded | shadow */}
                    <DropdownTrigger>
                      <Button
                        className="bg-gray-200 text-gray-500"
                        variant="light"
                        radius="full"
                      >
                        {`Covers ${category.topics.length} insights`}{" "}
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
                      {category.topics?.map((topic) => (
                        <DropdownItem
                          onClick={() => router.push(`/topic/${topic._id}`)}
                          key={topic._id}
                        >
                          {" "}
                          {topic.versions[0].title}
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
          const formattedDate = formatDate(category.updatedAt);
          const formattedTime = formatTime(category.updatedAt);

          return (
            <>
              {isCategory ? (
                <>
                  <div className="text-[14px] mt-1">{formattedDate}</div>
                  <div className="text-[12px] mt-1">{formattedTime}</div>
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
              {isCategory ? (
                <div className="flex">
                  <button onClick={handleEditCategory.bind(this, category)}>
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
                  </button>
                  <button
                    onClick={() => {
                      category.archived
                        ? handleUnArchiveCategory(category._id)
                        : handleArchiveCategory(category._id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      color={category.archived ? "#41e841" : "#FF3B30"}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className={`w-8 h-8 mx-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg active:scale-95 active:shadow-md ${
                        category.archived ? "bg-[#5cff5c]" : "bg-[#FF3B30]"
                      } bg-opacity-20 p-2`}
                    >
                      <path
                        strokeLinecap="round"
                        d={
                          category.archived
                            ? "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                            : "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                        } //"M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                  </button>

                  {/* Approve Button */}
                  {!isApproved(category._id) ? (
                    <button
                      onClick={() => handleApprove(category._id)}
                      className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl items-center mx-1"
                      disabled={isApproved(category._id)}
                    >
                      <span className="text-xs">Approve</span>
                    </button>
                  ) : (
                    <div className="bg-green-500 text-white font-medium text-xs px-4 py-2 rounded-2xl flex items-center">
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      <span className="text-xs">Verified</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex w-fit">
                  <Skeleton className="h-8 w-8 mr-5 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              )}
            </>
          );

        default:
          return <div></div>;
      }
    },
    [handleArchiveCategory, handleUnArchiveCategory, handleEditCategory, router]
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="pt-4 bg-white rounded-2xl px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {count} categories in total
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={categoryFilters.page}
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
  }, [categoryFilters, pages, onNextPage, onPageChange, onPreviousPage, count]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
        sortDescriptor={{
          column: categoryFilters.sortBy,
          direction:
            categoryFilters.sortOrder == "asc" ? "ascending" : "descending",
        }}
        onSortChange={(e) => sortTable(e)}
        topContentPlacement="outside"
        removeWrapper={true}
        className="text-secondary w-full h-full"
      >
        <TableHeader columns={tHeads}>
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
            {categories.map((category: Category) => (
              <TableRow
                key={category._id}
                className="hover:bg-gray-100 transition-colors"
              >
                {(columnKey) => (
                  <TableCell className="px-2 py-[.4rem] border-b border-gray-200">
                    {renderCell(true, category, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default CategoryTable;