import CategoryTable from "@/components/category/CategoryTable";
import { IoAddOutline } from "react-icons/io5";
import { Category } from "@/types/category";
import RootLayout from "@/layouts/RootLayout";

import React, { useEffect, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import AddCategoryDialog from "@/components/category/AddCategoryDialog";
import { SortDescriptor } from "@nextui-org/react";
import { useGetSortedCategoriesQuery } from "@/api/category-api";
import { useRouter } from "next/router";
import { SelectButton } from "@/components/common/SelectSingle";
import { SingleSelect } from "@/types/select";

function Categories() {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        Category | undefined
    >(undefined);
    const [pages, setPages] = useState(1);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [categoryFilters, setCategoryFilters] = useState({
        page: Number(router.query.page) || 0,
        limit: 5,
        sortBy: router.query.sortBy?.toString() || "rank",
        sortOrder: router.query.sortOrder?.toString() || "asc",
        isArchived:
            String(router.query.isArchived) == "true"
                ? true
                : String(router.query.isArchived) == "false"
                ? false
                : "all",
        keyword: router.query.keyword?.toString() || "",
    });

    const updatePath = (filterData: any) => {
        const paramString = Object.entries(filterData)
            .map(([key, value]) =>
                value != null ? `${key}=${value}` : undefined
            )
            .filter((item) => item != null)
            .join("&");
        router.push(`/category?${paramString}`, undefined, {
            shallow: true,
        });
    };

    const changeFilter = async (e: string | boolean) => {
        setLoading(true);
        setCategories([]);
        const newFilters = {
            ...categoryFilters,
            isArchived: e,
        };
        setCategoryFilters(newFilters);
        console.log(newFilters, e);
        updatePath(newFilters);
        await refetch();
        setLoading(false);
    };

    useEffect(() => {
        setCategoryFilters({
            page: Number(router.query.page) || 1,
            limit: 5,
            sortBy: router.query.sortBy?.toString() || "rank",
            sortOrder: router.query.sortOrder?.toString() || "asc",
            isArchived:
                String(router.query.isArchived) == "true"
                    ? true
                    : String(router.query.isArchived) == "false"
                    ? false
                    : "all",
            keyword: router.query.keyword?.toString() || "",
        });

        setSelectedFilter(
            filters.filter(
                (filter: SingleSelect) =>
                    filter.value == router.query.isArchived
            )[0]
        );

        if (!router.query.page || Number(router.query.page) == 0) {
            const filters = {
                page: 1,
                limit: 5,
                sortBy: "rank",
                sortOrder: "asc",
                isArchived: "all",
                keyword:"",
            };
            setCategoryFilters(filters);
            updatePath(filters);
        }
    }, [router.query]);

    const {
        data: res,
        refetch,
        isSuccess,
    } = useGetSortedCategoriesQuery({
        page: categoryFilters.page || 1,
        limit: 5,
        sortBy: categoryFilters.sortBy || "rank",
        sortOrder: categoryFilters.sortOrder || "asc",
        isArchived: categoryFilters.isArchived || "false",
        keyword: categoryFilters.keyword || "",
    });

    useEffect(() => {
        if (isSuccess) {
            setCategories(res.data.categories);
            setPages(Math.ceil(res.data.count / 5));
            setLoading(false);
        }
    }, [res, isSuccess]);

    useEffect(() => {
        refetch();
    }, [categoryFilters]);

    const searchCategories = async (keyword: string) => {
        setLoading(true);
        setCategories([]);
        const newFilters = {
            ...categoryFilters,
            page: 1,
            keyword: keyword,
        };
        setCategoryFilters(newFilters);
        updatePath(newFilters);
        await refetch();
        setLoading(false);
    };

    const sortTable = async (e: SortDescriptor) => {
        setLoading(true);
        setCategories([]);
        const filters = {
            ...categoryFilters,
            sortBy: e.column?.toString() || "rank",
            sortOrder: e.direction == "ascending" ? "asc" : "desc",
        };
        setCategoryFilters(filters);
        updatePath(filters);
        await refetch();
        setLoading(false);
    };
    
    const onNextPage = async () => {
        setLoading(true);
        if (categoryFilters.page < pages) {
            setCategories([]);
            const filters = {
                ...categoryFilters,
                page: categoryFilters.page + 1,
            };
            setCategoryFilters(filters);
            updatePath(filters);
            await refetch();
        }
        setLoading(false);
    };

    const onPageChange = async (e: number) => {
        setLoading(true);
        setCategories([]);
        const filters = {
            ...categoryFilters,
            page: e,
        };
        setCategoryFilters(filters);
        updatePath(filters);
        await refetch();
        setLoading(false);
    };

    const onPreviousPage = async () => {
        setLoading(true);
        if (categoryFilters.page > 1) {
            setCategories([]);
            const filters = {
                ...categoryFilters,
                page: categoryFilters.page - 1,
            };
            setCategoryFilters(filters);
            updatePath(filters);
            await refetch();
        }
        setLoading(false);
    };

    const handleAddCategory = () => {
        setOpen(true);
        setSelectedCategory(undefined);
    };

    const filters: SingleSelect[] = [
        {
            _id: "1",
            name: "All",
            value: "all",
        },
        {
            _id: "3",
            name: "Active",
            value: "false",
        },
        {
            _id: "2",
            name: "Archived",
            value: "true",
        },
    ];
    
    const [selectedFilter, setSelectedFilter] = useState<SingleSelect>(
        filters[0]
    );
    return (
        <RootLayout>
            <div className="mx-16 my-6 h-full">
                <SearchBar text={"categories"} isVisible={true} onSearch={searchCategories} />
                <div className="rounded-xl h-[82%] overflow-scroll">
                    <div className="z-10 pb-6 px-4 sticky top-0">
                        <div className="h-28 w-full rounded-lg bg-white shadow-sm">
                            <div className="flex items-center justify-between pt-4 px-6">
                                <div className="font-semibold text-xl text-subtitle">
                                    Categories
                                </div>

                                <div className="flex items-center space-x-8">
                                    <button
                                        onClick={handleAddCategory}
                                        className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl flex items-center"
                                    >
                                        <IoAddOutline className="mr-4 h-4 w-4" />
                                        Add Category
                                    </button>
                                    <SelectButton
                                        options={filters}
                                        functionTrigger={changeFilter}
                                        selectedFilter={selectedFilter}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mx-4 my-1">
                        <CategoryTable
                            setOpen={setOpen}
                            setSelectedCategory={setSelectedCategory}
                            categoryFilters={categoryFilters}
                            setCategoryFilters={setCategoryFilters}
                            pages={pages}
                            loading={loading}
                            setLoading={setLoading}
                            setCategories={setCategories}
                            refetch={refetch}
                            count={res?.data.count || 0}
                            categories={categories}
                            onPageChange={onPageChange}
                            onPreviousPage={onPreviousPage}
                            onNextPage={onNextPage}
                            sortTable={sortTable}
                        />
                    </div>
                </div>
            </div>
            {open && (
                <AddCategoryDialog
                    setOpen={setOpen}
                    editData={selectedCategory}
                />
            )}
        </RootLayout>
    );
}

export default Categories;