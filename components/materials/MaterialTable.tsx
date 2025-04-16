import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Skeleton,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { FC, Key, useMemo } from "react";
import { Material } from "@/types/material";

interface MaterialTableProps {
  isSplitView: boolean;
  page: number;
  materials: Material[];
  router: any;
  count: number;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  pages: number;
  materialFilters: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
    isArchived: boolean | string;
  };
  sortTable: (sortKey: string) => void;
  loading: boolean;
}

export const MaterialTable: FC<MaterialTableProps> = ({
  isSplitView,
  page,
  materials,
  router,
  count,
  onPageChange,
  onPreviousPage,
  onNextPage,
  pages,
  materialFilters,
  sortTable,
  loading,
}) => {
  const defaultFilters = {
    page: 1,
    limit: 10,
    sortBy: "updatedAt",
    sortOrder: "desc",
    isArchived: false,
  };

  const filters = materialFilters || defaultFilters;

  return (
    <>
      {isSplitView ? (
        <SplitTableView materials={materials} />
      ) : (
        <FullViewTable
          isSplitView={true}
          page={page}
          materials={materials}
          router={router}
          count={count}
          onPageChange={onPageChange}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          pages={pages}
          materialFilters={filters}
          sortTable={sortTable}
          loading={loading}
        />
      )}
    </>
  );
};

const FullViewTable: FC<MaterialTableProps> = ({
  page,
  materials,
  router,
  count,
  onPageChange,
  pages,
  materialFilters,
  sortTable,
  loading,
}) => {
  const tableHeads = [
    { name: "Title", uid: "title", sortable: true },
    { name: "Image", uid: "image", sortable: false },
    { name: "Description", uid: "description", sortable: false },
    { name: "Time", uid: "time", sortable: true },
    { name: "Actions", uid: "actions", sortable: false },
  ];

  const shimmers: Material[] = Array(5).fill({
    _id: "",
    title: "",
    description: "",
    archived: false,
    thumbnailImage: "",
    document: "",
    createdAt: "",
    updatedAt: "",
  });

  const renderCell = (isMaterial: boolean, material: Material, columnKey: Key) => {
    switch (columnKey) {
      case "title":
        return isMaterial ? (
          <div style={{ color: "black" }}>{material.title}</div>
        ) : (
          <Skeleton className="w-32 h-4" />
        );
      case "image":
        return isMaterial ? (
          material.thumbnailImage ? (
            <Image
              src={material.thumbnailImage}
              alt="Material Thumbnail"
              width={50}
              height={50}
              className="rounded-full"
            />
          ) : (
            <div className="text-s h-10 w-10 bg-gray-200 rounded-sm"></div>
          )
        ) : (
          <Skeleton className="h-10 w-10 rounded-md" />
        );
      case "description":
        return isMaterial ? (
          <div style={{ color: "black" }}>{material.description}</div>
        ) : (
          <Skeleton className="w-64 h-4" />
        );
      case "archived":
        return isMaterial ? (
          <div style={{ color: "black" }}>{material.archived ? "Yes" : "No"}</div>
        ) : (
          <Skeleton className="w-16 h-4" />
        );
      case "actions":
        return isMaterial ? (
          
          <div className="flex space-x-2">
            <Link href={`materials/edit-material/${material._id}`}>
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
                    // onClick={() => {
                    //   insight.archived
                    //     ? handleUnArchiveInsight(insight._id)
                    //     : handleArchiveInsight(insight._id);
                    // }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      color={material.archived ? "#41e841" : "#FF3B30"}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className={`w-8 h-8 mx-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg active:scale-95 active:shadow-md ${
                        material.archived ? "bg-[#5cff5c]" : "bg-[#FF3B30]"
                      } bg-opacity-20 p-2 shadow-md`}
                    >
                      <path
                        strokeLinecap="round"
                        d={
                          material.archived
                            ? "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                            : "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                        }
                      />
                    </svg>
                  </button>


          </div>
        ) : (
          <Skeleton className="w-16 h-8" />
        );
      default:
        return null;
    }
  };

  // const bottomContent = useMemo(
  //   () => (
  //     <div className="flex justify-between items-center">
  //       <span style={{ color: "black" }}>{count} materials in total</span>
  //       <Pagination
  //         page={materialFilters?.page || 1}
  //         total={pages}
  //         onChange={(page) => onPageChange(page)}
  //       />
  //     </div>
  //   ),
  //   [count, materialFilters?.page, pages, onPageChange]
  // );

   const bottomContent = useMemo(() => {
      return (
        <div className="pt-4 bg-white rounded-2xl px-2 flex justify-between items-center">
          <span className="w-[30%] text-small text-default-400">
            {count} materials in total
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={materialFilters.page}
            total={pages}
            onChange={(e) => onPageChange(e)}
          />
          <div className="hidden sm:flex w-[30%] justify-end gap-2">
            <Button
              isDisabled={pages === 1}
              size="sm"
              variant="flat"
              // onPress={onPreviousPage}
            >
              Previous
            </Button>
            <Button
              isDisabled={pages === 1}
              size="sm"
              variant="flat"
              // onPress={onNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      );
    }, [page, pages, 
      // onNextPage, 
      onPageChange, 
      // onPreviousPage, 
      count]);
  

  return (
    <div className="p-4 bg-white rounded shadow">
      <Table
        aria-label="Materials Table"
        bottomContent={bottomContent}
        sortDescriptor={{
          column: materialFilters?.sortBy || "updatedAt",
          direction: materialFilters?.sortOrder === "asc" ? "ascending" : "descending",
        }}
        // onSortChange={(key) => sortTable(key)}
      >
        <TableHeader columns={tableHeads}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              <span style={{ color: "black" }}>{column.name}</span>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {(loading ? shimmers : materials).map((material, i) => (
            <TableRow key={material._id || i}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(!!material._id, material, columnKey)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const SplitTableView: FC<{ materials: Material[] }> = ({ materials }) => {
  return (
    <div className="p-4">
      <Accordion>
        {materials.map((material, i) => (
          <AccordionItem
            key={material._id || i}
            title={<span style={{ color: "black" }}>{`${i + 1}. ${material.title}`}</span>}
          >
            <div className="text-sm" style={{ color: "black" }}>
              {material.description}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default MaterialTable;
