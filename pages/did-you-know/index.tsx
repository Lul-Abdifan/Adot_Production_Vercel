import { useGetAllFactsQuery } from "../../api/did-you-know";
import SearchBar from "@/components/common/SearchBar";
import { SelectButton } from "@/components/common/SelectSingle";
import { AddDidYouKnowDialog } from "@/components/did-you-know/AddDidYouKnowDialog";
import { DidYouKnowTable } from "@/components/did-you-know/DidYouKnowTable";
import RootLayout from "@/layouts/RootLayout";
import { SingleSelect } from "@/types/select";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";


// Import your dialog component

function DidYouKnow() {
  const [isSplitView, setIsSplitView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [didYouKnows, setDidYouKnows] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog visibility state

  const [didYouKnowFilters, setDidYouKnowFilters] = useState({
    page: 1,
    limit: 5,
    sortBy: "rank",
    sortOrder: "asc",
    isArchived: "all",
    keyword: "",
  });

  const mockDidYouKnows = [
    { id: 1, fact: "Did you know fact 1", rank: 1 },
    { id: 2, fact: "Did you know fact 2", rank: 2 },
    { id: 3, fact: "Did you know fact 3", rank: 3 },
  ];

  useEffect(() => {
    setDidYouKnows(mockDidYouKnows);
    setPages(Math.ceil(mockDidYouKnows.length / 5));
  }, []);

  const viewFilters: SingleSelect[] = [
    { _id: "1", name: "All Facts", value: false },
    { _id: "2", name: "By Topic", value: true },
  ];

  const filters: SingleSelect[] = [
    { _id: "1", name: "All", value: "all" },
    { _id: "3", name: "Active", value: "false" },
    { _id: "2", name: "Archived", value: "true" },
  ];

  const searchDidYouKnows = (keyword: string) => {
    setLoading(true);
    const filteredFacts = mockDidYouKnows.filter((fact) =>
      fact.fact.toLowerCase().includes(keyword.toLowerCase())
    );
    setDidYouKnows(filteredFacts);
    setLoading(false);
  };

  const onNextPage = () => {
    if (page < pages) {
      setPage(page + 1);
    }
  };

  const onPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const onPageChange = (e: number) => {
    setPage(e);
  };

  const sortTable = (sortDescriptor: { column: string; direction: string }) => {
    const { column, direction } = sortDescriptor;
    setDidYouKnowFilters((prevFilters) => ({
      ...prevFilters,
      sortBy: column,
      sortOrder: direction === "ascending" ? "asc" : "desc",
    }));

    const sortedFacts = [...didYouKnows].sort((a, b) => {
      return direction === "ascending"
        ? a[column] > b[column]
          ? 1
          : -1
        : a[column] < b[column]
        ? 1
        : -1;
    });

    setDidYouKnows(sortedFacts);
  };
const { data, error, isLoading } = useGetAllFactsQuery(null);
const facts = data?.data || []; 
  return (
    <RootLayout>
      <Head>Did You Know</Head>
      <div className="mx-16 my-6 h-full">
        <SearchBar
          text={"did you know"}
          isVisible={true}
          onSearch={searchDidYouKnows}
        />
        <div className="h-[84%] rounded-xl overflow-scroll">
          <div className="z-10 pb-6 px-4 sticky top-0">
            <div className="h-28 w-full rounded-lg shadow-sm bg-white border-gray-300">
              <div className="flex items-center justify-between pt-4 px-6">
                <div className="font-semibold text-xl text-subtitle">
                  Did You Know
                </div>

                <div className="flex items-center space-x-8">
                  {!isSplitView && (
                    <>
                      <button
                        onClick={() => setIsDialogOpen(true)} // Open dialog on button click
                        className="bg-primary text-white font-medium text-xs px-4 mx-6 py-2 rounded-2xl flex items-center"
                      >
                        <IoAddOutline className="mr-4 h-4 w-4" />
                        Add Fact
                      </button>
                      {/* <SelectButton
                        options={filters}
                        functionTrigger={() => {}}
                        selectedFilter={filters[0]}
                      /> */}
                    </>
                  )}
                  {/* <SelectButton
                    options={viewFilters}
                    functionTrigger={setIsSplitView}
                  /> */}
                </div>
              </div>

              <div className="w-fit ml-auto mr-9 mt-4"></div>
            </div>
          </div>

          <div className="my-1 mx-4">
            <DidYouKnowTable
              isSplitView={isSplitView}
              page={page}
              facts={facts}
              count={didYouKnows.length}
              onPageChange={onPageChange}
              onPreviousPage={onPreviousPage}
              onNextPage={onNextPage}
              pages={pages}
              filters={didYouKnowFilters}
              sortTable={sortTable}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Render the dialog conditionally */}
      {isDialogOpen && <AddDidYouKnowDialog setOpen={setIsDialogOpen} />}
    </RootLayout>
  );
}

export default DidYouKnow;