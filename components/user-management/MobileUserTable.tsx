import { User, MobileUser } from "@/types/user";
import React, { Key, useCallback, useMemo, useState, FC } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Pagination,
    Avatar,
    Chip,
    Skeleton,
} from "@nextui-org/react";
import Image from "next/image";
import DeleteUserDialog from "./DeleteDialog";

interface MobileUserTableProps {
    data: {
        data: {
            data: MobileUser[];
        };
    };
    pages: number;
    users: MobileUser[];
    setMobileUsers: Function;
    sortTable: Function;
    loading: boolean;
    setLoading: Function;
    mobileUsersFilters: {
        page: number;
        limit: number;
        status: string;
        sortBy: string;
        sortOrder: string;
    };
    setUserFilters: Function;
    onNextPage: any;
    onPageChange: Function;
    onPreviousPage: any;
    count: number;
}

export const MobileUserTable: FC<MobileUserTableProps> = ({
    data,
    pages,
    users,
    sortTable,
    mobileUsersFilters,
    loading,
    setLoading,
    setMobileUsers,
    setUserFilters,
    onNextPage,
    onPageChange,
    onPreviousPage,
    count,
}) => {
    const tableHeads = [
        { name: "", uid: "image", sortable: false },
        { name: "Name", uid: "name", sortable: true },
        { name: "Phone No.", uid: "phoneNumber", sortable: false },
        { name: "Last Active On", uid: "lastActive", sortable: true },
        { name: "Actions", uid: "actions", sortable: false },
    ];

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState("");

    const t: MobileUser = {
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        isActive: true,
        lastActive: "",
        profileImage: "",
    };

    const shimmers = [t, t, t, t];

    const openDeleteDialog = (userId: string) => {
        setUserIdToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

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

    const renderCell = (isUser: boolean, user: MobileUser, columnKey: Key) => {
        switch (columnKey) {
            case "name":
                return (
                    <>
                        {isUser ? (
                            <div className="text-s text-title font-normal">
                                {user && user.firstName} {user && user.lastName}
                            </div>
                        ) : (
                            <div className="mr-32 w-full">
                                <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                            </div>
                        )}
                    </>
                );
            case "image":
                return (
                    <>
                        {isUser ? (
                            <>
                                {user.profileImage ? (
                                    <div className="bg-gray-200 rounded-full w-[55px] h-[55px] border border-primary border-4">
                                        <Image
                                            src={user.profileImage}
                                            alt="Profile"
                                            width={50}
                                            height={50}
                                            className="rounded-full w-[50px] h-[50px]"
                                        />
                                    </div>
                                ) : (
                                    <Avatar className="bg-gray-200 rounded-full w-[45px] h-[45px] border border-primary border-4 text-[16px]"
                                        name={user.firstName ? user.firstName[0].toUpperCase() : ":("}
                                    />
                                )}
                            </>
                        ) : (
                            <Skeleton className="h-10 w-10 rounded-full" />
                        )}
                    </>
                );
            case "phoneNumber":
                return (
                    <>
                        {isUser ? (
                            <div className="text-s text-title font-light">
                                {user && user.phoneNumber}
                            </div>
                        ) : (
                            <div className="mr-32 w-full">
                                <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                            </div>
                        )}
                    </>
                );
            case "lastActive":
                const formattedDate = formatDate(user.lastActive);
                return (
                    <>
                        {isUser ? (
                            <>
                                <div className="text-s mt-1">
                                    {formattedDate}
                                </div>
                            </>
                        ) : (
                            <div className="w-full mr-24">
                                <Skeleton className="h-3 mb-2 w-3/5 rounded-full" />
                                <Skeleton className="h-3 my- w-2/5 rounded-full" />
                            </div>
                        )}
                    </>
                );
            case "actions":
                return (
                    <>
                        {isUser ? (
                            <div className="flex">
                                <button
                                    onClick={() => openDeleteDialog(user._id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        color="#FF3B30"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-8 h-8 mx-2 rounded-full bg-[#FF3B30] bg-opacity-20 p-2 w-8 h-8 mx-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg active:scale-95 active:shadow-md"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex w-fit">
                                <Skeleton className="h-8 w-20 mr-5" />
                            </div>
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
                <span className="w-[30%] px-2 text-small text-default-400">
                    {count} users in total
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={mobileUsersFilters.page}
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
    }, [
        mobileUsersFilters.page,
        pages,
        data?.data?.data?.length,
        onNextPage,
        onPageChange,
        onPreviousPage,
    ]);

    return (
        <>
            {isDeleteDialogOpen && (
                <DeleteUserDialog
                    _id={userIdToDelete}
                    setOpen={setIsDeleteDialogOpen}
                />
            )}
            <div className="p-6 bg-white rounded-2xl shadow-sm">
                <Table
                    aria-label="Mobile user table"
                    isHeaderSticky
                    bottomContent={bottomContent}
                    bottomContentPlacement="inside"
                    sortDescriptor={{
                        column: mobileUsersFilters.sortBy,
                        direction:
                            mobileUsersFilters.sortOrder == "asc"
                                ? "ascending"
                                : "descending",
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
                                align={
                                    column.uid === "actions"
                                        ? "center"
                                        : "start"
                                }
                                allowsSorting={column.sortable}
                                className="text-[14px] bg-gray-200"
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    {loading ? (
                        <TableBody>
                            {shimmers.map((user, i) => (
                                <TableRow key={i}>
                                    {(columnKey) => (
                                        <TableCell>
                                            {renderCell(false, user, columnKey)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                        
                    ) : (
                        <TableBody>
                            {users.map((item) => (
                                <TableRow key={item._id} className="hover:bg-gray-100 transition-colors">
                                    {(columnKey) => (
                                        <TableCell className="px-2 py-[.4rem] border-b border-gray-200">
                                            {renderCell(true, item, columnKey)}
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
