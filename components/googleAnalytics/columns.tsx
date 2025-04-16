"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../common/Button";

export type PageAndScreenAnalyticsDataType = {
  unifiedScreenName: string;
  screenPageViews: string;
  totalUsers: string;
  screenPageViewsPerUser: string;
  userEngagementDuration: string;
  eventCount: string;
};

export const columns: ColumnDef<PageAndScreenAnalyticsDataType>[] = [
  {
    accessorKey: "unifiedScreenName",
    header: ({ column }: any) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Page Title and Screen Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "screenPageViews",
    header: ({ column }: any) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const views = row.original.screenPageViews;
      return (
        <>
          {Number(views).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </>
      );
    },
  },
  {
    accessorKey: "totalUsers",
    header: ({ column }: any) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Users
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const users = row.original.totalUsers;
      return (
        <>
          {Number(users).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </>
      );
    },
  },
  {
    accessorKey: "screenPageViewsPerUser",
    header: ({ column }: any) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Views Per User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const views = row.original.screenPageViewsPerUser;
      return (
        <>
          {Number(views).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </>
      );
    },
  },
  {
    accessorKey: "userEngagementDuration",
    header: ({ column }: any) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Average Engagement Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const totalViewsTime = row.original.userEngagementDuration;
      const totalUsers = row.original.totalUsers;
      let averageViewTime = Number(totalViewsTime) / Number(totalUsers);
      const d = Math.floor(averageViewTime / (3600 * 24));

      averageViewTime -= d * 3600 * 24;

      const h = Math.floor(averageViewTime / 3600);

      averageViewTime -= h * 3600;

      const m = Math.floor(averageViewTime / 60);

      averageViewTime -= m * 60;

      const tmp = [];

      d && tmp.push(d + "d");

      (d || h) && tmp.push(h + "h");

      (d || h || m) && tmp.push(m + "m");

      tmp.push(averageViewTime.toFixed(0) + "s");

      return <>{tmp.join(" ")}</>;
    },
  },
  {
    accessorKey: "eventCount",
    header: ({ column }: any) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Event Count
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const totalEvents = row.original.eventCount;
      return (
        <>
          {Number(totalEvents).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </>
      );
    },
  },
];