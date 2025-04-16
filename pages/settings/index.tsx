import RootLayout from "@/layouts/RootLayout";
import { Tab, Tabs } from "@nextui-org/react";
import Head from "next/head";
import React, { useState } from "react";
import Image from "next/image";
import EditProfile from "@/components/profile/EditProfile";
import { useSession } from "next-auth/react";
import { Key } from "@react-types/shared";
import UpdatePassword from "@/components/profile/UpdatePassword";

function Settings() {
    const tabs = [{ name: "Edit Profile" }, { name: "Update Password" }];
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
    const [selectedTab, setTab] = useState<Key>("Edit Profile");

    return (
        <RootLayout>
            <Head>Adot Dashboard</Head>
            <div className="mx-16 my-6 h-full bg-white rounded-2xl p-6">
                <div className="h-full rounded-xl overflow-scroll no-scrollbar">
                    <div className="">
                        <span className="font-medium flex p-3 sticky top-0 text-lg text-secondary">
                            Settings
                        </span>
                        <div className="flex flex-wrap bg-white gap-4 sticky top-0 z-10 pb-1 pt-4">
                            <Tabs
                                variant={"underlined"}
                                aria-label="Tabs variants"
                                color="primary"
                                radius="full"
                                size="md"
                                className="bg-rd-200 text-xs"
                                selectedKey={selectedTab}
                                onSelectionChange={(e) => setTab(e)}
                            >
                                {tabs.map((tab) => (
                                    <Tab
                                        className="font-medium"
                                        key={tab.name}
                                        title={tab.name}
                                    />
                                ))}
                            </Tabs>
                        </div>
                        {selectedTab == "Edit Profile" && <EditProfile />}
                        {selectedTab == "Update Password" && <UpdatePassword />}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}


export default Settings;
