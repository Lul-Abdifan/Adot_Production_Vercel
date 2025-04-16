import { User } from "@/types/user";
import Link from "next/link";
import React, { Key, useMemo, useState, FC } from "react";
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
import UpdateRoleDialog from "./UpdateRoleDialog";
import DeleteUserDialog from "./DeleteDialog";
import Image from "next/image";
import { string } from "zod";
interface UserTableProps {
    data: {
            data:{
                data:{
                    users: User[], 
                    count:number
                    }
                }
            };
    pages: number;
    users: User[];
    setUsers: Function;
    sortTable: Function;
    loading: boolean;
    setLoading: Function;
    onPreviousPage: any;
    onPageChange: Function;
    onNextPage: any;
    usersFilters: {
        page: number;
        limit: number;
        role: string;
        status: string;
        sortBy: string;
        sortOrder: string;
    };
    setUserFilters: Function;
}

export const UserTable: FC<UserTableProps> = ({
    data,
    pages,
    users,
    sortTable,
    usersFilters,
    loading,
    onPreviousPage,
    onPageChange,
    onNextPage,
}) => {
    const tableHeads = [
        { name: "", uid: "image", sortable: false },
        { name: "Name", uid: "name", sortable: true },
        { name: "Status", uid: "status", sortable: false },
        { name: "Email", uid: "email", sortable: false },
        { name: "Role", uid: "role", sortable: true },
        { name: "Date", uid: "date", sortable: true },
        { name: "Actions", uid: "actions", sortable: false },
    ];


    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currUser, setCurrUser] = useState<User>();
    const [profileImageUrl, setProfileImageUrl] = useState<string | "">("");

    const t: User = {
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        isActive: true,
        isVerified: true,
        role: "",
        createdAt: "",
        updatedAt: "",
        profileImage: undefined,
        hospitalId: "false"
    };

    const shimmers = [t, t, t, t, t];

    const openDialog = (user: User) => {
        setCurrUser(user);

        setIsDialogOpen(true);
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

    const [userId, setUserId] = useState("");
    const [open, setOpen] = useState(false);

    const deleteUser = (_id: string) => {
        setUserId(_id);
        setOpen(true);
    };

    const renderCell = (isUser: boolean, user: User, columnKey: Key) => {
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
            case "role":
                return (
                    <>
                        {isUser ? (
                            <div className="text-s text-title font-normal">
                                {user && user.role}
                            </div>
                        ) : (
                            <div className="mr-32 w-full">
                                <Skeleton className="h-3 mb-2 w-3/5 rounded-full" />
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
                                    <div className="bg-gray-200 rounded-full w-[50px] h-[50px] border-primary border-4">
                                        <Image
                                            src={user.profileImage}
                                            alt="Profile"
                                            width={45}
                                            height={45}
                                            className="rounded-full w-[45px] h-[45px]"
                                        />
                                    </div>
                                ) : (
                                    <Avatar className="bg-gray-200 rounded-full w-[50px] h-[50px]  border-primary border-4 text-[16px]" name={user.firstName[0]} />
                                )}
                            </>
                        ) : (
                            <Skeleton className="h-10 w-10 rounded-full" />
                        )}
                    </>
                );
            case "email":
                return (
                    <>
                        {isUser ? (
                            <Link href={`mailto:${user.email}`} passHref>
                                <button className="bg-gray-200 px-2 py-1 rounded-[30px] flex justify-center text-[14px] font-normal hover:bg-[#0055ff] hover:text-white">
                                    {user && user.email}
                                </button>
                            </Link>
                        ) : (
                            <div className="mr-32 w-full">
                                <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                            </div>
                        )}
                    </>
                );
            case "status":
                return (
                    <>
                        {isUser ? (
                            <>
                                {user.isActive && user.isVerified && (
                                    <Chip
                                        className="capitalize px-2"
                                        color={"success"}
                                        size="md"
                                        variant="flat"
                                    >
                                        Active
                                    </Chip>
                                )}
                                {user.isActive && !user.isVerified && (
                                    <Chip
                                        className="capitalize px-2"
                                        color={"warning"}
                                        size="md"
                                        variant="flat"
                                    >
                                        Pending
                                    </Chip>
                                )}
                                {!user.isActive && (
                                    <Chip
                                        className="capitalize px-2"
                                        color={"danger"}
                                        size="md"
                                        variant="flat"
                                    >
                                        Archived
                                    </Chip>
                                )}
                            </>
                        ) : (
                            <div className="mr-3 w-full">
                                <Skeleton className="h-6 mb-2 w-20 rounded-full" />
                            </div>
                        )}
                    </>
                );
            case "date":
                const formattedDate = formatDate(user.updatedAt);
                const formattedTime = formatTime(user.updatedAt);
                return (
                    <>
                        {isUser ? (
                            <>
                                <div className="text-[14px] mt-1">
                                    {formattedDate}
                                </div>
                                <div className="text-[12px] mt-2">
                                    {formattedTime}
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
                                <button onClick={() => deleteUser(user._id)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        color="#FF3B30"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="bg-[#FF3B30] bg-opacity-20 p-2 w-8 h-8 mx-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg active:scale-95 active:shadow-md"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                                        />
                                    </svg>
                                </button>
                                <button onClick={() => openDialog(user)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        color="#AE709F"
                                        viewBox="0 0 25 25"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-8 h-8 mx-2 rounded-full bg-[#AE709F] bg-opacity-20 p-2 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg hover:bg-opacity-30 active:scale-95 active:shadow-md shadow-sm"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 14 3-3m-3 3 3 3m-3-3h16v-3m2-7-3 3m3-3-3-3m3 3H3v3"
                                        />
                                    </svg>
                                </button>
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
    };

    const bottomContent = useMemo(() => {
        return (
            <div className="pt-4 bg-white rounded-2xl px-2 flex justify-between items-center">
                <span className="w-[30%] px-2 text-small text-default-400">
                    {data?.data?.data?.count} users in total
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={usersFilters.page}
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
        usersFilters.page,
        pages,
        data?.data?.data?.count,
        onNextPage,
        onPageChange,
        onPreviousPage,
    ]);

    return (
        <>
            {open && <DeleteUserDialog _id={userId} setOpen={setOpen} />}
            {isDialogOpen && (
                <UpdateRoleDialog
                    user={currUser}
                    setIsDialogOpen={setIsDialogOpen}
                />
            )}
            <div className="p-6 bg-white rounded-2xl shadow-sm">
                <Table
                    aria-label="Example table with custom cells, pagination and sorting"
                    isHeaderSticky
                    bottomContent={bottomContent}
                    bottomContentPlacement="inside"
                    sortDescriptor={{
                        column: usersFilters.sortBy,
                        direction:
                            usersFilters.sortOrder == "asc"
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
