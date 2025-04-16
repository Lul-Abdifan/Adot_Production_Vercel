import { useGetSortedInsightsQuery } from "@/api/insight-api";
import SearchBar from "@/components/common/SearchBar";
import { SelectButton } from "@/components/common/SelectSingle";
import InsightTable from "@/components/insights/InsightTable";
import RootLayout from "@/layouts/RootLayout";
import { Insight } from "@/types/insight";
import { SingleSelect } from "@/types/select";
import { SortDescriptor } from "@nextui-org/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";

function Insights() {
    const [isSplitView, setIsSplitView] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [insights, setInsights] = useState<Insight[]>([]);
    const router = useRouter();

    const [insightFilters, setInsightFilters] = useState({
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
        router.push(`/insights?${paramString}`, undefined, {
            shallow: true,
        });
    };

    const changeFilter = async (e: string | boolean) => {
        setLoading(true);
        setInsights([]);
        const newFilters = {
            ...insightFilters,
            isArchived: e,
        };
        setInsightFilters(newFilters);
        updatePath(newFilters);
        await refetch();
        setLoading(false);
    };

    useEffect(() => {
        setInsightFilters({
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
                keyword: "",
            };
            setInsightFilters(filters);
            updatePath(filters);
        }
    }, [router.query]);

    const viewFilters: SingleSelect[] = [
        {
            _id: "1",
            name: "All Insights",
            value: false,
        },
        {
            _id: "2",
            name: "By Topic",
            value: true,
        },
    ];

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

    const {
        data: res,
        refetch,
        isSuccess,
    } = useGetSortedInsightsQuery({
        page: insightFilters.page || 1,
        limit: 5,
        sortBy: insightFilters.sortBy || "rank",
        sortOrder: insightFilters.sortOrder || "asc",
        isArchived: insightFilters.isArchived || "false",
        keyword: insightFilters.keyword || "",
    });

    useEffect(() => {
        if (isSuccess) {
            setInsights(res.data.insights);
            setPages(Math.ceil(res.data.count / 5));
            setLoading(false);
        }
    }, [res, isSuccess]);

    useEffect(() => {
        refetch();
    }, [insightFilters]);

    const searchInsights = async (keyword: string) => {
        setLoading(true);
        setInsights([]);
        const newFilters = {
            ...insightFilters,
            page: 1,
            keyword: keyword,
        };
        setInsightFilters(newFilters);
        updatePath(newFilters);
        await refetch();
        setLoading(false);
    };

    const sortTable = async (e: SortDescriptor) => {
        setLoading(true);
        setInsights([]);
        const filters = {
            ...insightFilters,
            sortBy: e.column?.toString() || "rank",
            sortOrder: e.direction == "ascending" ? "asc" : "desc",
        };
        setInsightFilters(filters);
        updatePath(filters);
        await refetch();
        setLoading(false);
    };

    const onNextPage = async () => {
        setLoading(true);
        if (insightFilters.page < pages) {
            setInsights([]);
            const filters = {
                ...insightFilters,
                page: insightFilters.page + 1,
            };
            setInsightFilters(filters);
            updatePath(filters);
            await refetch();
        }
        setLoading(false);
    };

    const onPageChange = async (e: number) => {
        setLoading(true);
        setInsights([]);
        const filters = {
            ...insightFilters,
            page: e,
        };
        setInsightFilters(filters);
        updatePath(filters);
        await refetch();
        setLoading(false);
    };

    const onPreviousPage = async () => {
        setLoading(true);
        if (insightFilters.page > 1) {
            setInsights([]);
            const filters = {
                ...insightFilters,
                page: insightFilters.page - 1,
            };
            setInsightFilters(filters);
            updatePath(filters);
            await refetch();
        }
        setLoading(false);
    };

    const [selectedFilter, setSelectedFilter] = useState<SingleSelect>(
        filters[0]
    );

    return (
        <RootLayout>
            <Head>Insight</Head>
            <div className="mx-16 my-6 h-full">
                <SearchBar text={"insights"} isVisible={true} onSearch={searchInsights}/>
                <div className="h-[84%] rounded-xl overflow-scroll">
                    <div className="z-10 pb-6 px-4 sticky top-0">
                        <div className="h-28 w-full rounded-lg shadow-sm bg-white border-gray-300">
                            <div className="flex items-center justify-between pt-4 px-6">
                                <div className="font-semibold text-xl text-subtitle">
                                    Insights
                                </div>

                                <div className="flex items-center space-x-8">
                                    {!isSplitView && (
                                        <>
                                            <Link
                                                href={"/insights/add-insight/1"}
                                            >
                                                <button className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl flex items-center">
                                                    <IoAddOutline className="mr-4 h-4 w-4" />
                                                    Add Insight
                                                </button>
                                            </Link>
                                          
                                            <SelectButton
                                                options={filters}
                                                functionTrigger={changeFilter}
                                                selectedFilter={selectedFilter}
                                                
                                            />
                                           
                                        </>
                                    )}

                                    <SelectButton
                                        options={viewFilters}
                                        functionTrigger={setIsSplitView}
                                    />
                                </div>
                            </div>

                            <div className="w-fit ml-auto mr-9 mt-4"></div>
                        </div>
                    </div>

                    <div className="my-1 mx-4">
                        <InsightTable
                            isSplitView={isSplitView}
                            page={page}
                            insights={insights}
                            router={router}
                            count={res ? res?.data.count : 0}
                            onPageChange={onPageChange}
                            onPreviousPage={onPreviousPage}
                            onNextPage={onNextPage}
                            pages={pages}
                            insightFilters={insightFilters}
                            sortTable={sortTable}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}

export default Insights;