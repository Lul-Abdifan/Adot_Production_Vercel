"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";

import { metrics } from "@/constants/constants";
import { getNextSaturday, getPreviousSunday } from "@/utils/date-format";

import { columns, PageAndScreenAnalyticsDataType } from "./columns";
import { DataTable } from "./data-table";
import { DatePickerWithRange } from "./date-range-picker-shadcn";

export function AnalyticsDataContainer() {
  const router = useRouter();
  const today = new Date();
  const [startDate, setstartdate] = useState<string>(getPreviousSunday(today));
  const [endDate, setenddate] = useState<string>(getNextSaturday(today));

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<Array<PageAndScreenAnalyticsDataType>>([]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/runReports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
        dimensions: [{ name: "unifiedScreenName" }],
        metrics: metrics.map((val) => ({ name: val.value })),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then(({ data }: { data: PageAndScreenAnalyticsDataType[] }) => {
        if (!data || data.length === 0) {
          throw new Error("No data returned");
        }
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went wrong!");
        console.log(err);
        router.push("/error"); // Navigate to the error page using Next.js router
      });
  }, [startDate, endDate]);


  return (
    <div className="space-y-4 py-4">
      <div className="justify-between items-center flex gap-3">
        <h3 className="text-xl text-primary font-semibold ml-5">Features Analytics</h3>
        <DatePickerWithRange
          setstartdate={setstartdate}
          setenddate={setenddate}
        />
      </div>
      <DataTable columns={columns} data={data} isLoading={loading} />
    </div>
  );
}