import { useGetSortedTopicsQuery } from "@/api/topic-api";
import SearchBar from "@/components/common/SearchBar";
import { SelectButton } from "@/components/common/SelectSingle";
import TopicTable from "@/components/topic/TopicTable";
import RootLayout from "@/layouts/RootLayout";
import { SingleSelect } from "@/types/select";
import { Topic } from "@/types/topic";
import { SortDescriptor } from "@nextui-org/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";

function Topics() {
    const [isSplitView, setIsSplitView] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState(1);
    const [topics, setTopics] = useState<Topic[]>([]);
    const router = useRouter();

    const [topicFilters, setTopicFilters] = useState({
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
        router.push(`/topic?${paramString}`, undefined, {
            shallow: true,
        });
    };

    const changeFilter = async (e: string | boolean) => {
        setLoading(true);
        setTopics([]);
        const newFilters = {
            ...topicFilters,
            isArchived: e,
        };
        setTopicFilters(newFilters);
        updatePath(newFilters);
        await refetch();
        setLoading(false);
    };

    useEffect(() => {
        setTopicFilters({
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
            setTopicFilters(filters);
            updatePath(filters);
        }
    }, [router.query]);

    const viewFilters: SingleSelect[] = [
        {
            _id: "1",
            name: "All Topics",
            value: false,
        },
        {
            _id: "2",
            name: "By Category",
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

    const [selectedFilter, setSelectedFilter] = useState<SingleSelect>(
        filters[0]
    );
    
    const {
        data: res,
        refetch,
        isSuccess,
    } = useGetSortedTopicsQuery({
        page: topicFilters.page || 1,
        limit: 5,
        sortBy: topicFilters.sortBy || "rank",
        sortOrder: topicFilters.sortOrder || "asc",
        isArchived: topicFilters.isArchived || "false",
        keyword: topicFilters.keyword || "",
    });

    useEffect(() => {
        if (isSuccess) {
            setTopics(res.data.topics);
            setPages(Math.ceil(res.data.count / 5));
            setLoading(false);
        }
    }, [res, isSuccess]);

    useEffect(() => {
        refetch();
    }, [topicFilters]);

    const searchTopics = async (keyword: string) => {
        setLoading(true);
        setTopics([]);
        const newFilters = {
            ...topicFilters,
            page: 1,
            keyword: keyword,
        };
        setTopicFilters(newFilters);
        updatePath(newFilters);
        await refetch();
        setLoading(false);
    };

    const sortTable = async (e: SortDescriptor) => {
        setLoading(true);
        setTopics([]);
        const filters = {
            ...topicFilters,
            sortBy: e.column?.toString() || "rank",
            sortOrder: e.direction == "ascending" ? "asc" : "desc",
        };
        setTopicFilters(filters);
        updatePath(filters);
        await refetch();
        setLoading(false);
    };

    const onNextPage = async () => {
        setLoading(true);
        if (topicFilters.page < pages) {
            setTopics([]);
            const filters = {
                ...topicFilters,
                page: topicFilters.page + 1,
            };
            setTopicFilters(filters);
            updatePath(filters);
            await refetch();
        }
        setLoading(false);
    };

    const onPageChange = async (e: number) => {
        setLoading(true);
        setTopics([]);
        const filters = {
            ...topicFilters,
            page: e,
        };
        setTopicFilters(filters);
        updatePath(filters);
        await refetch();
        setLoading(false);
    };

    const onPreviousPage = async () => {
        setLoading(true);
        if (topicFilters.page > 1) {
            setTopics([]);
            const filters = {
                ...topicFilters,
                page: topicFilters.page - 1,
            };
            setTopicFilters(filters);
            updatePath(filters);
            await refetch();
        }
        setLoading(false);
    };

    return (
        <RootLayout>
            <Head>Topic</Head>
            <div className="mx-16 my-6 h-full">
                <SearchBar text={"topics"} isVisible={true} onSearch={searchTopics}/>
                <div className="h-[82%] rounded-xl overflow-scroll border-gray-300">
                    <div className="z-10 pb-6 px-4 sticky top-0">
                        <div className="h-28 w-full rounded-lg shadow-sm bg-white border-gray-300">
                            <div className="flex items-center justify-between pt-4 px-6">
                                <div className="font-semibold text-xl text-subtitle">
                                    Topics
                                </div>

                                <div className="flex items-center space-x-8">
                                    {!isSplitView && (
                                        <>
                                            <Link
                                                href={"/topic/add-topic/1"}
                                                className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl flex items-center"
                                            >
                                                <IoAddOutline className="mr-2 h-4 w-4" />
                                                <span className="text-xs">
                                                    Add Topic
                                                </span>
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

                    <div className="mx-4 my-1">
                        <TopicTable
                            topics={topics}
                            isSplitView={isSplitView}
                            router={router}
                            count={res ? res?.data.count : 0}
                            onPageChange={onPageChange}
                            onPreviousPage={onPreviousPage}
                            onNextPage={onNextPage}
                            pages={pages}
                            topicFilters={topicFilters}
                            sortTable={sortTable}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}

export default Topics;