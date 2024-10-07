"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, Cross2Icon } from "@radix-ui/react-icons";
import {  format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";

export function CalendarDateRangePicker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [date, setDate] = useState<DateRange | undefined>();

  useEffect(() => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    if (fromParam && toParam) {
      const from = new Date(fromParam);
      const to = new Date(toParam);

      if (from !== date?.from || to !== date?.to) {
        setDate({
          from,
          to,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (date?.from && date?.to) {
      const params = new URLSearchParams(searchParams);
      params.set("from", format(date.from, "yyyy-MM-dd"));
      params.set("to", format(date.to, "yyyy-MM-dd"));

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [date]);

  const handleReset = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("from");
    params.delete("to");
    router.replace(`${pathname}?${params.toString()}`);

    setDate(undefined);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[260px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
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
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {date && (
        <Button
          variant="ghost"
          onClick={() => handleReset()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
