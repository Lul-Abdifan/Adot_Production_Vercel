import { DatePickerWithRange } from "../common/DatePickerRange";
import { useGetPopularCategoriesQuery } from "@/api/dashboard-api";
import { PopularCategory } from "@/types/categoryPopularity";
import { getNextSaturday, getPreviousSunday } from "@/utils/date-format";
// Import debounce for better search handling
import {
  Button,
  Pagination,
  Skeleton,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { Key, useCallback, useEffect, useMemo, useState } from "react";

interface CategoryTableProps {}

const CategoryPopularityTable: React.FC<CategoryTableProps> = () => {
  const tHeads = [
    { name: "Rank", uid: "rank", sortable: true },
    { name: "Category Title", uid: "title", sortable: true },
    { name: "Total View", uid: "views", sortable: true },
    { name: "Completion", uid: "completion", sortable: true },
    { name: "Popularity Level", uid: "popularity", sortable: true },
  ];

  const today = new Date();
  const [startDate, setstartdate] = useState<string>(getPreviousSunday(today));
  const [endDate, setenddate] = useState<string>(getNextSaturday(today));
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState<PopularCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });

  const shimmers: PopularCategory[] = Array(5).fill(null);

  const {
    data: res,
    isSuccess: isPopularSuccess,
    refetch,
  } = useGetPopularCategoriesQuery({
    page: page,
    limit: 5,
    sortBy: sortDescriptor.column,
    sortOrder: sortDescriptor.direction == "ascending" ? "asc" : "desc",
    isArchived: false,
    startDate: startDate,
    endDate: endDate,
    searchQuery: searchQuery,
  });
  console.log("here", res?.data.categories[0]?.category.versions.title);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setLoading(true);
      setSearchQuery(value); // Update searchQuery when user types
      setPage(1); // Reset to first page when searching
      refetch();
      setLoading(false);
    }, 300), // 300ms debounce delay to prevent excessive API calls
    [refetch]
  );

  // Replace the input field's event with a form-based submit handler
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    handleSearch(searchQuery); // Trigger the search when form is submitted
  };

  useEffect(() => {
    if (!res) {
      return;
    }
    if (isPopularSuccess) {
      setCategories(res.data.categories);
      if (res?.data?.count) setPages(Math.ceil(res.data.count / 5));
      setLoading(false);
    }
  }, [res, isPopularSuccess]);

  const sortTable = useCallback(
    async (e: SortDescriptor) => {
      setLoading(true);
      setCategories([]);
      setSortDescriptor(e);
      await refetch();
      setLoading(false);
    },
    [refetch]
  );

  useEffect(() => {
    if (res && isPopularSuccess) {
      setCategories(res.data.categories);
      if (res?.data?.count) setPages(Math.ceil(res.data.count / 5));
      setLoading(false);
    }
  }, [res, isPopularSuccess]);

  useEffect(() => {
    refetch();
  }, [page, refetch, startDate, endDate, searchQuery]);

  const renderCell = useCallback(
    (category: PopularCategory, columnKey: Key) => {
      console.log(category);
      switch (columnKey) {
        case "rank":
          return (
            <>
              {isPopularSuccess ? (
                <div className="text-s text-title ">
                  {category?.category?.rank ? category.category.rank : "0"}
                </div>
              ) : (
                <Skeleton className="h-5 mb-2 w-8 rounded-xl" />
              )}
            </>
          );
        case "title":
          return (
            <>
              {isPopularSuccess ? (
                <div className="text-s text-title font-light">
                  {category?.category?.versions?.title ?? "Title not available"}
                </div>
              ) : (
                <div className="mr-32 w-full">
                  <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                  <Skeleton className="h-3 my- w-3/5 rounded-full" />
                </div>
              )}
            </>
          );
        case "views":
          return (
            <>
              {isPopularSuccess ? (
                <div className="text-s text-center">
                  {category?.viewCount ? category.viewCount : "0"}
                </div>
              ) : (
                <Skeleton className="h-4 w-3/5 mr-24 rounded-full" />
              )}
            </>
          );
        case "completion":
          return (
            <>
              {isPopularSuccess ? (
                <div className="text-s text-center">
                  {category?.completionCount ? category?.completionCount : "0"}
                </div>
              ) : (
                <div className="w-full mr-16">
                  <Skeleton className="h-4 w-3/5 mr-24 rounded-full" />
                </div>
              )}
            </>
          );
        case "popularity":
          return (
            <>
              {isPopularSuccess ? (
                <div className="flex">
                  <div
                    className={`w-full ${
                      category?.popularityLevel < 30
                        ? "bg-[#FBDCD5]"
                        : category?.popularityLevel < 70
                        ? "bg-[#FBF0E4]"
                        : "bg-[#DEF5EB]"
                    } rounded-full h-1.5 dark:bg-gray-700`}
                  >
                    <div
                      className={`h-1.5 rounded-full ${
                        category?.popularityLevel < 30
                          ? "bg-archive"
                          : category?.popularityLevel < 70
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                      style={{
                        width: `${category?.popularityLevel}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex w-fit">
                    <Skeleton className="h-2 w-56 mr-5 rounded-lg" />
                  </div>
                </>
              )}
            </>
          );
        default:
          return <div></div>;
      }
    },
    [isPopularSuccess]
  );

  const onPageChange = useCallback(
    async (e: number) => {
      setLoading(true); // Show loader
      setCategories([]); // Clear current categories
      setPage(e); // Update the page state
      await refetch(); // Refetch data
      setLoading(false); // Hide loader
    },
    [refetch]
  );
  const onNextPage = useCallback(async () => {
    if (page < pages) {
      onPageChange(page + 1);
    }
  }, [page, pages, onPageChange]);

  const onPreviousPage = useCallback(async () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  }, [page, onPageChange]);

  useEffect(() => {
    refetch(); // Fetch data when page changes
  }, [page, refetch, startDate, endDate, searchQuery]);

  const bottomContent = useMemo(() => {
    return (
      <div className="pt-4 bg-white rounded-2xl px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {res?.data.count} categories in total
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page} // Current page
          total={pages} // Total number of pages
          onChange={(e) => onPageChange(e)} // Trigger page change
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
  }, [page, pages, onNextPage, onPageChange, onPreviousPage, res?.data.count]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-8 items-center">
          <span className="text-sm">Category Popularity Tracker</span>

          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-[344px]"
          >
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search categories..."
              value={searchQuery} // Bind the input to the searchQuery state
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
            />
          </form>

          <div>
            <DatePickerWithRange
              setstartdate={setstartdate}
              setenddate={setenddate}
            />
          </div>
        </div>
      </div>
    );
  }, [handleSearchSubmit, searchQuery]);

  return (
    <div className="p-6 mt-4 bg-white rounded-2xl shadow-sm">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
        sortDescriptor={sortDescriptor}
        onSortChange={(e) => sortTable(e)}
        topContent={topContent}
        topContentPlacement="inside"
        removeWrapper={true}
        className="text-secondary w-full h-full"
      >
        <TableHeader columns={tHeads}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className="text-[15px] bg-gray-200"
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
                  <TableCell>{renderCell(topic, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No categories have been viewed."}>
            {categories &&
              categories.map((category) => (
                <TableRow
                  key={category.documentId}
                  className="hover:bg-gray-100 transition-colors"
                >
                  {(columnKey) => (
                    <TableCell className="px-4 py-2 border-b border-gray-200">
                      {renderCell(category, columnKey)}
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

export default CategoryPopularityTable;
