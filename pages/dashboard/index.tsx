"use client";

import CategoryAnalytics from "@/components/dashboard/tabs/CategoryAnalytics";
import InsightAnalytics from "@/components/dashboard/tabs/InsightAnalytics";
import Overview from "@/components/dashboard/tabs/Overview";
import TopicAnalytics from "@/components/dashboard/tabs/TopicAnalytics";
import UsersAnalytics from "@/components/dashboard/tabs/UsersAnalytics";
import { AnalyticsDataContainer } from "@/components/googleAnalytics/data-analytics";
import RootLayout from "@/layouts/RootLayout";
import { Tab, Tabs } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import DoctorAnalytics from "@/components/dashboard/tabs/DoctorAnalytics";

function Dashboard() {
    const tabs = [
      "Overview",
      "Doctor Analytics",
      "Users Analytics",
      "Insights Analytics",
      "Topics Analytics",
      "Categories Analytics",
      "Google Data Analytics",
    ];

    const map = useMemo(() => new Map(), []);

    map.set("overview", "Overview");
    map.set("users", "Users Analytics");
     map.set("doctor", "Doctor Analytics");
    map.set("insights", "Insights Analytics");
    map.set("topics", "Topics Analytics");
    map.set("categories", "Categories Analytics");
    map.set("google", "Google Data Analytics");

    const router = useRouter();
    const [selectedTab, setTab] = useState(map.get(router.query.tab));

    useEffect(() => {
        setTab(map.get(router.query.tab));
    }, [router, map]);

    const changeTab = (e: any) => {
        const t = e.split(" ");
        router.push(`/dashboard?tab=${t[0].toLowerCase()}`, undefined, {
            shallow: true,
        });
        setTab(e);
    };
    
    useEffect(() => {
        setTab(map.get(router.query.tab));

        if (!router.query.tab) {
            setTab("overview");
            router.push(`/dashboard?tab=overview`, undefined, {
                shallow: true,
            });
        }
    }, [map, router.query.tab, router]);

    const userData: any = useSession();

    const user = {
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        profileImage: "",
    };

    if (userData.status == "authenticated") {
        user.name = userData.data.profile.name;
        user.firstName = userData.data.profile.firstName;
        user.lastName = userData.data.profile.lastName;
        user.email = userData.data.profile.email;
        user.role = userData.data.profile.role;
        if (userData.data.profile.profileImage)
            user.profileImage = userData.data.profile.profileImage;
    }

    return (
        <RootLayout>
            <Head>Adot Dashboard</Head>
            <div className="mx-16 mt-6 h-full">
                <div className="flex items-center justify-between h-20 w-full mb-4 rounded-3xl bg-primary pr-14 pl-8">
                    <div className="relative">
                        <div className="text-white text-sm rounded-xl pt-0.5 w-96 h-full">
                            <p>Statistics Analysis</p>
                            <p className="text-xs pt-1">{selectedTab}</p>
                        </div>
                    </div>

                    <div className="flex items-center text-right">
                        <div className="mr-4">
                            <p className="text-sm text-white font-medium">
                                {user.name}
                            </p>
                            <p className="text-xs text-white  text-opacity-70">
                                {user.role}
                            </p>
                        </div>

                        <div className="ring-1 rounded-full ring-[#f4e4f4] p-1">
                            {" "}
                            {user.profileImage ? (
                                <Image
                                    src={user.profileImage}
                                    alt="Profile"
                                    width={50}
                                    height={50}
                                    className="w-10 h-10 rounded-full"
                                    title={user.email} 
                                />
                            ) : (
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-400">
                                    <span className="font-medium text-xs leading-none text-white">
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="h-[82%] rounded-xl overflow-scroll no-scrollbar">
                    <div className="">
                        <div className="flex flex-wrap gap-4 z-10 sticky top-0 bg-[#faf8fa] pb-1">
                            <Tabs
                                variant={"underlined"}
                                aria-label="Tabs variants"
                                color="primary"
                                radius="full"
                                size="sm"
                                className="bg-rd-200 text-xs"
                                selectedKey={selectedTab}
                                onSelectionChange={(e) => changeTab(e)}
                            >
                                {tabs.map((tab) => (
                                    <Tab key={tab} title={tab} />
                                ))}
                            </Tabs>
                        </div>
                        {selectedTab == "Overview" && <Overview />}
                        {selectedTab == "Users Analytics" && <UsersAnalytics />}
                         {selectedTab == "Doctor Analytics" && <DoctorAnalytics />}
                        {selectedTab == "Insights Analytics" && (
                            <InsightAnalytics />
                        )}
                        {selectedTab == "Topics Analytics" && (
                            <TopicAnalytics />
                        )}
                        {selectedTab == "Categories Analytics" && (
                            <CategoryAnalytics />
                        )}
                        {selectedTab == "Google Data Analytics" && (
                            <AnalyticsDataContainer />
                        )}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}

export default Dashboard;