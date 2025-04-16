import { useGetAllUsersQuery, useGetAllMobileUsersQuery } from "@/api/user-api";
import SearchBar from "@/components/common/SearchBar";
import { SelectMultipleButton } from "@/components/common/SelectMultiple";
import AddUserDialog from "@/components/user-management/AddUserDialog";
import { UserTable } from "@/components/user-management/UserTable";
import { Tab, Tabs } from "@nextui-org/react";
import { MobileUserTable } from "@/components/user-management/MobileUserTable";
import RootLayout from "@/layouts/RootLayout";
import { MultipleSelect } from "@/types/select";
import { DashboardUsersTableFilters, MobileUser, User } from "@/types/user";
import { SortDescriptor } from "@nextui-org/react";
import Head from "next/head";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from "next/router";

function Users() {
    const [pages, setPages] = useState(1);
    const [mobilePages, setMobilePages] = useState(1);
    const [users, setUsers] = useState<User[]>([]);
    const [mobileUsers, setMobileUsers] = useState<MobileUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [values, setValues] = useState(new Set<String>());
    const [mobileValues, setMobileValues] = useState(new Set<String>());
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const router = useRouter();

    const [usersFilters, setUsersFilters] = useState({
        page: Number(router.query.page) || 0,
        limit: 5,
        role: router.query.role?.toString() || "",
        status: router.query.status?.toString() || "",
        sortBy: router.query.sortBy?.toString() || "name",
        sortOrder: router.query.sortOrder?.toString() || "asc",
        keyword: router.query.keyword?.toString() || "",
    });

    const [mobileUsersFilters, setMobileUsersFilters] = useState({
        page: Number(router.query.page) || 0,
        limit: 5,
        sortBy: router.query.sortBy?.toString() || "name",
        sortOrder: router.query.sortOrder?.toString() || "asc",
        status: router.query.status?.toString() || "",
        keyword: router.query.keyword?.toString() || "",
    });

    const updatePath = (filterData: any) => {
        const filters = Object.entries(filterData)
            .map(([key, value]) =>
                value != null ? `${key}=${value}` : undefined
            )
            .filter((item) => item != null)
            .join("&");

        let tabs = "&tab=dashboard-users";

        if (selectedTab) {
            const t = selectedTab.split(" ");
            const tab = `${t[0].toLowerCase()}-${t[1].toLowerCase()}`;
            tabs = `&tab=${tab}`;
        }

        const paramString = filters.concat(tabs);
        router.push(`/user-management?${paramString}`, undefined, {
            shallow: true,
        });
    };

    useEffect(() => {
        if (router.query.tab && router.query.tab == "mobile-users") {
            setMobileUsersFilters({
                page: Number(router.query.page) || 1,
                limit: 5,
                status: router.query.status?.toString() || "",
                sortBy: router.query.sortBy?.toString() || "name",
                sortOrder: router.query.sortOrder?.toString() || "asc",
                keyword: router.query.keyword?.toString() || "",
            });

            setTab(router.query.tab || "mobile-users");
            const statuses = router.query.status?.toString().split(",");
            const vals = new Set(mobileValues);
            if (statuses) statuses.map((status) => vals.add(status));
            setMobileValues(vals);
        } else {
            setUsersFilters({
                page: Number(router.query.page) || 1,
                limit: 5,
                role: router.query.role?.toString() || "",
                status: router.query.status?.toString() || "",
                sortBy: router.query.sortBy?.toString() || "name",
                sortOrder: router.query.sortOrder?.toString() || "asc",
                keyword: router.query.keyword?.toString() || "",
            });

            setTab(router.query.tab || "dashboard-users");
            const roles = router.query.role?.toString().split(",");
            const statuses = router.query.status?.toString().split(",");
            const vals = new Set(values);
            if (roles) roles.map((role) => vals.add(role));

            if (statuses) statuses.map((status) => vals.add(status));
            setValues(vals);

            if (!router.query.page || Number(router.query.page) == 0) {
                const filters = {
                    page: 1,
                    limit: 5,
                    sortBy: "name",
                    sortOrder: "asc",
                    role: "",
                    status: "",
                    keyword: "",
                };
                setTab("dashboard-users");
                setUsersFilters(filters);
                updatePath(filters);
            }
        }
    }, [router.query]);

    const data: any = useGetAllUsersQuery({
        pageNumber: usersFilters.page || 1,
        limit: 5,
        role: usersFilters.role || "",
        status: usersFilters.status || "",
        sortBy: usersFilters.sortBy || "name",
        sortOrder: usersFilters.sortOrder || "asc",
        keyword: usersFilters.keyword || "",
    });


    useEffect(() => {
        if (data.isSuccess) {
            setPages(Math.ceil(data.data?.data?.count / 5));
            setUsers(data.data.data.users);
            setLoading(false);
        }
    }, [data]);

    const mobileUserData: any = useGetAllMobileUsersQuery({
        pageNumber: mobileUsersFilters.page || 1,
        limit: mobileUsersFilters.limit || 5,
        sortBy: mobileUsersFilters.sortBy || "asc",
        sortOrder: mobileUsersFilters.sortOrder || "name",
        status: mobileUsersFilters.status || "",
        keyword: mobileUsersFilters.keyword || "",
    });

    useEffect(() => {
        if (mobileUserData.isSuccess) {
            setMobilePages(Math.ceil(mobileUserData.data?.data?.count / 5));
            setMobileUsers(mobileUserData.data.data.users);
            setLoading(false);
        }
    }, [mobileUserData]);

    useEffect(() => {
        if (mobileUserData.isLoading || mobileUserData.isFetching || data.isLoading || data.isFetching) {
            setLoading(true)
        }
    }, [mobileUserData, data])

    const filters: { [key: string]: MultipleSelect } = {
        Status: {
            options: [
                { value: "Active", label: "Active" },
                { value: "Pending", label: "Pending" },
                { value: "Archived", label: "Archived" },
            ],
        },
        Role: {
            options: [
                { value: "Admin", label: "Admin" },
                {
                    value: "Super Admin",
                    label: "Super Admin",
                },
                {
                    value: "Content Manager",
                    label: "Content Manager",
                },
            ],
        },
    };

    const mobileFilters: { [key: string]: MultipleSelect } = {
        Status: {
            options: [
                { value: "Active", label: "Active" },
                { value: "Pending", label: "Pending" },
                { value: "Archived", label: "Archived" },
            ],
        },
    };

    const changeValue = async (option: any) => {
        setLoading(true);
        setUsers([]);

        const vals = new Set(values);
        if (values.has(option.value)) {
            vals.delete(option.value);
        } else {
            vals.add(option.value);
        }

        setValues(vals);

        const selectedRoles = filters.Role.options
            .filter((option) => vals.has(option.value))
            .map((filter) => filter.label);

        const selectedStatus = filters.Status.options
            .filter((option) => vals.has(option.value))
            .map((filter) => filter.label);

        const roleFilters = selectedRoles.join(",");
        const statusFilters = selectedStatus.join(",");

        const newSetFilters = {
            ...usersFilters,
            role: roleFilters,
            status: statusFilters,
        };

        setUsersFilters(newSetFilters);
        updatePath(newSetFilters);
        await data.refetch();
        setLoading(false);
    };

    const changeMobileValue = async (option: any) => {
        setLoading(true);
        setMobileUsers([]);

        const vals = new Set(mobileValues);
        if (mobileValues.has(option.value)) {
            vals.delete(option.value);
        } else {
            vals.add(option.value);
        }
        setMobileValues(vals);

        const selectedStatus = mobileFilters.Status.options
            .filter((option) => vals.has(option.value))
            .map((filter) => filter.label);

        const statusFilters = selectedStatus.join(",");

        const newSetFilters = {
            ...usersFilters,
            status: statusFilters,
        };

        setUsersFilters(newSetFilters);
        updatePath(newSetFilters);

        mobileUserData.refetch();
        setLoading(false);
    };

    const sortTable = async (e: SortDescriptor) => {
        setLoading(true);
        setUsers([]);
        const filters = {
            ...usersFilters,
            sortBy: e.column?.toString() || "name",
            sortOrder: e.direction == "ascending" ? "asc" : "desc",
        };
        setUsersFilters(filters);
        updatePath(filters);
        await data.refetch();
        setLoading(false);
    };

    const sortMobileTable = async (e: SortDescriptor) => {
        setLoading(true);
        setMobileUsers([]);
        const filters = {
            ...mobileUsersFilters,
            sortBy: e.column?.toString() || "name",
            sortOrder: e.direction == "ascending" ? "asc" : "desc",
        };
        setMobileUsersFilters(filters);
        updatePath(filters);
        await mobileUserData.refetch();
        setLoading(false);
    };

    const onNextPage = async () => {
        setLoading(true);
        if (usersFilters.page < pages) {
            setUsers([]);
            const filters = {
                ...usersFilters,
                page: usersFilters.page + 1,
            };
            setUsersFilters(filters);
            updatePath(filters);
            await data.refetch();
        }
        setLoading(false);
    };

    const onNextMobilePage = async () => {
        setLoading(true);
        if (mobileUsersFilters.page < mobilePages) {
            setMobileUsers([]);
            const filters = {
                ...mobileUsersFilters,
                page: mobileUsersFilters.page + 1,
            };
            setMobileUsersFilters(filters);
            updatePath(filters);
            await mobileUserData.refetch();
        }
        setLoading(false);
    };

    const onPageChange = async (e: number) => {
        setLoading(true);
        setUsers([]);
        const filters = {
            ...usersFilters,
            page: e,
        };
        setUsersFilters(filters);
        updatePath(filters);
        await data.refetch();
        setLoading(false);
    };

    const onMobilePageChange = async (e: number) => {
        setLoading(true);
        setMobileUsers([]);
        const filters = {
            ...mobileUsersFilters,
            page: e,
        };

        setMobileUsersFilters(filters);
        updatePath(filters);
        await mobileUserData.refetch();
        setLoading(false);
    };

    const onPreviousPage = async () => {
        setLoading(true);
        if (usersFilters.page > 1) {
            setUsers([]);
            const filters = {
                ...usersFilters,
                page: usersFilters.page - 1,
            };
            setUsersFilters(filters);
            updatePath(filters);
            await data.refetch();
        }
        setLoading(false);
    };

    const onPreviousMobilePage = async () => {
        if (mobileUsersFilters.page > 1) {
            setMobileUsers([]);
            const filters = {
                ...mobileUsersFilters,
                page: mobileUsersFilters.page - 1,
            };
            setMobileUsersFilters(filters);
            updatePath(filters);
            await mobileUserData.refetch();
        }
        setLoading(false);
    };

    const searchMobileUsers = async (keyword: string) => {
        setLoading(true);
        setMobileUsers([]);
        const newFilters = {
            ...mobileUsersFilters,
            page: 1,
            keyword: keyword,
        };
        setMobileUsersFilters(newFilters);
        updatePath(newFilters);
        await mobileUserData.refetch();
        setLoading(false);
    };

    const searchDashboardUsers = async (keyword: string) => {
        setLoading(true);
        setUsers([]);
        const newFilters = {
            ...usersFilters,
            page: 1,
            keyword: keyword,
        };
        setUsersFilters(newFilters);
        updatePath(newFilters);
        await await data.refetch();
        setLoading(false);
    };

    const tabs = ["Dashboard Users", "Mobile Users"];

    const map = useMemo(() => new Map(), []);

    map.set("dashboard-users", "Dashboard Users");
    map.set("mobile-users", "Mobile Users");

    const [selectedTab, setTab] = useState(map.get(router.query.tab));

    useEffect(() => {
        setTab(map.get(router.query.tab));
    }, [router, map]);

    const changeTab = (e: any) => {
        const t = e.split(" ");
        const tab = `${t[0].toLowerCase()}-${t[1].toLowerCase()}`;
        setTab(`${t[0].toLowerCase()}-${t[1].toLowerCase()}`);
        let routeFilters = {};
        if (e == "Dashboard Users") {
            routeFilters = {
                page: 1,
                limit: 5,
                sortBy: "name",
                sortOrder: "asc",
                role: "",
                status: "",
            };
            setValues(new Set<String>());
        } else {
            routeFilters = {
                page: 1,
                limit: 5,
                sortBy: "name",
                sortOrder: "asc",
                status: "",
            };
            setMobileValues(new Set<String>());
        }

        const filterData = Object.entries(routeFilters)
            .map(([key, value]) =>
                value != null ? `${key}=${value}` : undefined
            )
            .filter((item) => item != null)
            .join("&");

        const paramString = filterData.concat(`&tab=${tab}`);
        router.push(`/user-management?${paramString}`, undefined, {
            shallow: true,
        });
        setTab(e);
    };

    return (
        <RootLayout>
            <Head>User Management</Head>
            <div className="mx-16 mt-6 h-full">
                <SearchBar text={`${selectedTab}`} onSearch={selectedTab === 'Mobile Users' ? searchMobileUsers : searchDashboardUsers}/>
                <div className="h-[82%] rounded-xl overflow-scroll no-scrollbar">
                    <div>
                        <div className="flex flex-wrap gap-4 z-20 sticky top-0 bg-[#faf8fa] pb-1">
                            <Tabs
                                variant={"underlined"}
                                aria-label="Tabs variants"
                                color="primary"
                                radius="full"
                                size="sm"
                                className="bg-[#faf8fa] text-xs"
                                selectedKey={selectedTab}
                                onSelectionChange={(e) => changeTab(e)}
                            >
                                {tabs.map((tab) => (
                                    <Tab key={tab} title={tab} />
                                ))}
                            </Tabs>
                        </div>
                        {selectedTab == "Dashboard Users" && (
                            <div className="my-6 h-full">
                                {isAddDialogOpen && (
                                    <AddUserDialog
                                        setAddDialogOpen={setAddDialogOpen}
                                    />
                                )}
                                {/* <SearchBar text={"users"} /> */}
                                <div className="h-[82%] rounded-xl -mt-5 overflow-scroll border-gray-300">
                                    <div className="z-10 pb-6 sticky top-0">
                                        <div className="h-28 w-full rounded-lg bg-white shadow-sm">
                                            <div className="flex items-center w-full justify-between pt-4 px-6">
                                                <div className="flex font-semibold text-xl text-subtitle">
                                                    <span className="flex">
                                                        All Dashboard Users
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            setAddDialogOpen(
                                                                true
                                                            )
                                                        }
                                                        className="bg-primary text-white font-medium text-xs mx-4 px-4 py-2 rounded-2xl flex items-center"
                                                    >
                                                        <IoAddOutline className="mr-2 h-4 w-4" />
                                                        <span className="text-xs">
                                                            Add Dashboard User
                                                        </span>
                                                    </button>
                                                </div>

                                                <div className="flex items-center space-x-8">
                                                    <SelectMultipleButton
                                                        options={filters}
                                                        values={values}
                                                        changeValue={
                                                            changeValue
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="ml-auto mt-3 w-fit"></div>
                                        </div>
                                    </div>

                                    <div className="my-1">
                                        <UserTable
                                            data={data}
                                            pages={pages}
                                            usersFilters={usersFilters}
                                            users={users}
                                            setUsers={setUsers}
                                            sortTable={sortTable}
                                            loading={loading}
                                            setLoading={setLoading}
                                            setUserFilters={setUsersFilters}
                                            onNextPage={onNextPage}
                                            onPageChange={onPageChange}
                                            onPreviousPage={onPreviousPage}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {selectedTab == "Mobile Users" && (
                            <div className="my-6 h-full">
                                <div className="h-[82%] -mt-5 rounded-xl overflow-scroll border-gray-300">
                                    <div className="z-10 pb-6 sticky top-0">
                                        <div className="h-28 w-full rounded-lg bg-white shadow-sm">
                                            <div className="flex items-center w-full justify-between pt-4 px-6">
                                                <div className="flex font-semibold text-xl text-subtitle">
                                                    <span className="flex">
                                                        All Mobile Users
                                                    </span>
                                                </div>

                                                <div className="flex items-center space-x-8">
                                                    <SelectMultipleButton
                                                        options={mobileFilters}
                                                        values={mobileValues}
                                                        changeValue={
                                                            changeMobileValue
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="my-1">
                                        <MobileUserTable
                                            data={mobileUserData}
                                            pages={mobilePages}
                                            users={mobileUsers}
                                            sortTable={sortMobileTable}
                                            mobileUsersFilters={
                                                mobileUsersFilters
                                            }
                                            setMobileUsers={setMobileUsers}
                                            loading={loading}
                                            setLoading={setLoading}
                                            setUserFilters={
                                                setMobileUsersFilters
                                            }
                                            onNextPage={onNextMobilePage}
                                            onPageChange={onMobilePageChange}
                                            onPreviousPage={
                                                onPreviousMobilePage
                                            }
                                            count={
                                                mobileUserData?.data?.data
                                                    ?.count | 0
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}

export default Users;