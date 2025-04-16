import { useGetAllFactsQuery } from "../../api/did-you-know";
import { Fact } from "@/types/didYouKnow";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Pagination, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { FC, Key, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import TurndownService from "turndown";
import AddDidYouKnowDialog from "./AddDidYouKnowDialog";

interface DidYouKnowTableProps {
  page: number;
  facts: Fact[];
  count: number;
  onPageChange: Function;
  onPreviousPage: any;
  onNextPage: any;
  pages: number;
  filters: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
  };
  sortTable: Function;
  loading: boolean;
  isSplitView: boolean; // Add this line
}

export const DidYouKnowTable: FC<DidYouKnowTableProps> = ({
  page,
  facts,
  count,
  onPageChange,
  onPreviousPage,
  onNextPage,
  pages,
  filters,
  sortTable,
  loading,
  isSplitView, // Destructure isSplitView
}) => {
  const tableHeads = [
    { name: "Fact", uid: "fact", sortable: true },
    { name: "Day", uid: "date", sortable: true },
    { name: "Actions", uid: "actions", sortable: false },
  ];
  const [editData, setEditData] = useState<Fact | null>(null); // State to store fact data for editing
 const [showDialog, setShowDialog] = useState(false); 
  const handleEditClick = (fact: Fact) => {
    setEditData(fact); // Set the fact to be edited
    setShowDialog(true); // Open the dialog
  };

  const turndownService = new TurndownService();
  const convertHtmlToMarkdown = (htmlContent: any) => {
    // Check if htmlContent is valid
    if (!htmlContent || typeof htmlContent !== "string") {
      return ""; // Return empty string or appropriate fallback if invalid
    }

    return turndownService.turndown(htmlContent);
  };

  const renderCell = (isFact: boolean, fact: any, columnKey: Key) => {
    switch (columnKey) {
      case "fact":
        return isFact ? (
          <div className="text-s text-title font-light  overflow-hidden">
            <ReactMarkdown>
              {convertHtmlToMarkdown(fact.text.en || "")}
            </ReactMarkdown>
            <ReactMarkdown>
              {convertHtmlToMarkdown(fact.text.am || "")}
            </ReactMarkdown>
          </div>
        ) : (
          <Skeleton className="h-3 mb-2 w-2/4 rounded-full" />
        );
      case "date":
       
        return <span>{fact.day}</span>;
       case "actions":
        return (
          <div className="flex">
            <button onClick={() => handleEditClick(fact)}>
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
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const bottomContent = useMemo(() => {
    return (
      <div className="pt-4 bg-white rounded-2xl px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {count} facts in total
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={filters.page}
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
    <div
      className={`p-6 bg-white rounded-2xl shadow-sm ${
        isSplitView ? "split-view" : ""
      }`}
    >
      <Table
        aria-label="Did You Know table"
        isHeaderSticky
        bottomContent={bottomContent}
        sortDescriptor={{
          column: filters.sortBy,
          direction: filters.sortOrder == "asc" ? "ascending" : "descending",
        }}
        onSortChange={(e) => sortTable(e)}
        className="text-secondary w-full h-full"
      >
        <TableHeader columns={tableHeads}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        {loading ? (
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {(columnKey) => (
                  <TableCell>{renderCell(false, {}, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {facts.map((fact) => (
              <TableRow key={fact._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(true, fact, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
       {showDialog && (
        <AddDidYouKnowDialog
          setOpen={setShowDialog}
          editData={editData} // Pass editData to dialog
        />
      )}
    </div>
  );
};
export default DidYouKnowTable;