import adotLogo from "../../public/common/adot-logo-white.png";
import * as dotenv from "dotenv";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineMenuFold, AiOutlineMenu } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { FaComment } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import {
  IoFolderOpenOutline,
  IoBulbOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { MdAutoGraph, MdOutlineTopic, MdOutlineQuiz } from "react-icons/md";
import {
  RiCheckboxBlankCircleFill,
  RiGroupLine,
  RiMenuFoldLine,
} from "react-icons/ri";

dotenv.config();

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function SideBarNav() {
  const userData: any = useSession();

  let role = "";

  if (userData.status == "authenticated") {
    role = userData.data.profile.role;
  }
  const router = useRouter();
  const paths = router.pathname.split("/");
  const map = useMemo(() => new Map(), []);

  if (role == "Super Admin" || role == "Admin") map.set("dashboard", 1);
  if (role == "Super Admin" || role == "Admin") map.set("user-management", 2);
  map.set("category", 3);
  map.set("topic", 4);
  map.set("insights", 5);
  map.set("quiz", 6);
  map.set("settings", 7);
  map.set("doctors", 8);
  map.set("feedbacks", 9);
  map.set("did-you-know", 10);

  const [activeTab, setActiveTab] = useState(map.get(paths[1]));
  const [isNavOpen, setIsNavOpen] = useState(true);

  useEffect(() => {
    setActiveTab(map.get(paths[1]));
  }, [paths, map]);

  let navigation: any = [];

  if (role == "Super Admin")
    navigation = [
      { name: "Analysis", i: 1, icon: MdAutoGraph, link: "/dashboard" },
      {
        name: "User Management",
        i: 2,
        icon: RiGroupLine,
        link: "/user-management",
      },
      {
        name: "Categories",
        i: 3,
        icon: IoFolderOpenOutline,
        link: "/category",
      },
      { name: "Topics", i: 4, icon: MdOutlineTopic, link: "/topic" },
      { name: "Insights", i: 5, icon: IoBulbOutline, link: "/insights" },
      { name: "Materials", i: 11, icon: IoFolderOpenOutline, link: "/materials" }, // Added Materials
      {
        name: "Did you Know",
        i: 10,
        icon: FaQuestion,
        link: "/did-you-know",
      },
      { name: "Quizzes", i: 6, icon: MdOutlineQuiz, link: "/quiz" },
      { name: "Doctors", i: 8, icon: FaUserDoctor, link: "/doctors" },
      { name: "User Feedbacks", i: 9, icon: FaComment, link: "/user-feedback" },
    ];
else if (role == "Admin")
    navigation = [
      { name: "Analysis", i: 1, icon: MdAutoGraph, link: "/dashboard" },
      {
        name: "Categories",
        i: 3,
        icon: IoFolderOpenOutline,
        link: "/category",
      },
      { name: "Topics", i: 4, icon: MdOutlineTopic, link: "/topic" },
      { name: "Insights", i: 5, icon: IoBulbOutline, link: "/insights" },
      { name: "Materials", i: 11, icon: IoFolderOpenOutline, link: "/materials" }, // Added Materials
      { name: "Quizzes", i: 6, icon: MdOutlineQuiz, link: "/quiz" },
      { name: "User Feedbacks", i: 9, icon: FaComment, link: "/user-feedback" },
    ];

  else if (role == "Hospital Admin")
    navigation = [
      { name: "Hospital Admin", i: 8, icon: FaUserDoctor, link: "/hospital" },
    ];
  else
    navigation = [
      {
        name: "Categories",
        i: 3,
        icon: IoFolderOpenOutline,
        link: "/category",
      },
      { name: "Topics", i: 4, icon: MdOutlineTopic, link: "/topic" },
      { name: "Insights", i: 5, icon: IoBulbOutline, link: "/insights" },
      { name: "Quizzes", i: 6, icon: MdOutlineQuiz, link: "/quiz" },
      { name: "User Feedbacks", i: 9, icon: FaComment, link: "/user-feedback" },
    ];

  const SetActiveMenuTab = (tab: number, link: string) => {
    router.push(link);
  };

  useEffect(() => {
    setActiveTab(map.get(paths[1]));
  }, [map, paths]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 1290) {
        setIsNavOpen(false);
      } else {
        setIsNavOpen(true);
      }
    });
  }, []);

  return (
    <div
      className={classNames(
        isNavOpen ? "w-[300px]" : "w-16",
        "h-screen grid grid-cols-12"
      )}
    >
      <div
        className={classNames(
          isNavOpen ? "" : "hidden",
          "bg-white flex col-span-11 flex-col gap-y-5 shadow-gray-300 shadow-2xl h-screen rounded-r-2xl"
        )}
      >
        <div className="flex h-24 min-h-24 items-center bg-primary">
          <Image
            className="relative mx-auto"
            src={adotLogo}
            alt="Adot Logo"
            width={115}
            height={100}
            priority
          />
        </div>

        <nav className="flex flex-1 flex-col bg-white overflow-scroll no-scrollbar rounded-br-xl pt-5">
          <ul role="list" className="flex flex-1 flex-col">
            <li>
              <ul role="list" className="-mx-2 px-6 space-y-1">
                {navigation.map((item: any, i: number) => (
                  <li key={i} className="h-9 rounded-xl">
                    <button
                      onClick={() => SetActiveMenuTab(item.i, item.link)}
                      className={classNames(
                        activeTab == item.i
                          ? "bg-[#EBD7E7] text-primary"
                          : "text-secondary hover:bg-lightPrimary",
                        "group flex gap-x-3 rounded-xl p-2 text-sm leading-6 font-medium h-full w-full"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          activeTab == item.i ? "text-primary" : "text-primary",
                          "h-4 w-4 mt-1 ml-2"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                      {activeTab == item.i ? (
                        <span
                          className="ml-auto text-center text-xs font-medium leading-5 text-white ring-none pt-1 pr-2"
                          aria-hidden="true"
                        >
                          <RiCheckboxBlankCircleFill className="h-3 w-3 text-primary" />
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            <div className="mt-auto px-6">
              <li className="w-full mt-auto">
                <button
                  onClick={() => SetActiveMenuTab(7, "/settings")}
                  className={classNames(
                    activeTab == 7
                      ? "bg-[#EBD7E7] text-primary"
                      : "text-secondary hover:bg-lightPrimary",
                    "group flex gap-x-3 rounded-xl p-2 py-3 text-sm leading-6 font-medium h-full w-full"
                  )}
                >
                  <IoSettingsOutline className="h-4 w-4 text-primary mt-1 ml-1" />
                  <span
                    className={classNames(
                      activeTab == 7 ? "text-primary" : "text-secondary",
                      "font-medium"
                    )}
                    aria-hidden="true"
                  >
                    Settings
                  </span>
                </button>
              </li>
              <li className="w-full mb-4">
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "https://admin.adot.life/login" });
                  }}
                  className="group flex gap-x-3 rounded-xl p-2 py-3 text-sm leading-6 font-medium h-full w-full hover:bg-lightPrimary"
                >
                  <BiLogOut className="h-4 w-4 text-primary mt-1 ml-0.5" />
                  <span
                    className="text-secondary font-medium"
                    aria-hidden="true"
                  >
                    Logout
                  </span>
                </button>
              </li>
            </div>
          </ul>
        </nav>
      </div>
      <div className="col-span-1">
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className={classNames(
            isNavOpen ? "-ml-4 mt-20" : "ml-3 mt-7 ring-2 ring-primary",
            "text-center h-9 w-9 rounded-full border-2 border-white bg-primary text-xs font-medium leading-5 text-white ring-none"
          )}
          aria-hidden="true"
        >
          {isNavOpen ? (
            <AiOutlineMenuFold className="h-5 w-5 ml-1.5 text-white" />
          ) : (
            <AiOutlineMenu className="h-5 w-5 ml-1.5 px-0.5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
