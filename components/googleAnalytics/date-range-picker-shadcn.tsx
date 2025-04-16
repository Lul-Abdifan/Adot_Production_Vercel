"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "../common/Button";
import { Calendar } from "../common/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../common/Popover";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/date-format";

type DateSetterFunction = (date: string) => void;

export function DatePickerWithRange({
  className,
  setstartdate,
  setenddate,
}: {
  className?: React.HTMLAttributes<HTMLDivElement>;
  setstartdate: DateSetterFunction;
  setenddate: DateSetterFunction;
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const handleDateChange = async (newDate: DateRange | undefined) => {
    try {
      setstartdate(formatDate(newDate?.from ?? new Date()));
      setenddate(formatDate(newDate?.to ?? new Date()));
      // Set the maximum range to 30 days
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    if (date) {
      handleDateChange(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[250px] justify-start text-left text-primary font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}