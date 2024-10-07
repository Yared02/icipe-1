"use client";

import { useState, useEffect } from "react";
import { addDays, parseISO } from "date-fns";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download, GraduationCap } from "lucide-react";
import { NumberCard } from "@/components/number-card";
import { TableCapDev } from "./table-capdev";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ahaxfqkzgbyovatyexfh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYXhmcWt6Z2J5b3ZhdHlleGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwNzE2MzcsImV4cCI6MjAzMDY0NzYzN30.LmTYUkwy4buaCMAVZmS0_Wj9JS-EZpe75BebmGVWWn0"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for parameters
interface CapacityDevelopmentPageProps {
  params: { id: string };
  searchParams?: { search?: string; from?: string; to?: string };
}

interface CapacityDevelopment {
  id: string;
  name: string;
  created_at: string;
  type: string;
  program_id: string;
  created_by: string;
}

export default function CapacityDevelopmentPage({
  params,
  searchParams,
}: CapacityDevelopmentPageProps) {
  // Define state with types
  const [capDevs, setCapDevs] = useState<CapacityDevelopment[]>([]);
  const [formalCapDevCount, setFormalCapDevCount] = useState<number>(0);
  const [informalCapDevCount, setInformalCapDevCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("id");

      const capDevsQuery = supabase
        .from("capacity_developments")
        .select("*")
        .eq("created_by", userId);

      if (searchParams?.search) {
        capDevsQuery.textSearch("name", searchParams.search);
      }
      if (searchParams?.from && searchParams.to) {
        capDevsQuery.gte("created_at", parseISO(searchParams.from).toISOString());
        capDevsQuery.lte(
          "created_at",
          addDays(parseISO(searchParams.to), 1).toISOString()
        );
      }
      const { data } = await capDevsQuery;
      setCapDevs(data ?? []);

      const formalCountQuery = await supabase
        .from("capacity_developments")
        .select("count()")
        .eq("program_id", params.id)
        .eq("type", "Formal");

      const informalCountQuery = await supabase
        .from("capacity_developments")
        .select("count()")
        .eq("program_id", params.id)
        .eq("type", "Informal");

      setFormalCapDevCount(0);
      setInformalCapDevCount( 0);
    };

    fetchData();
  }, [params.id, searchParams]);

  return (
    <div className="p-4 pt-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Capacity Development
        </h2>

        <div className="flex items-center space-x-3">
          <div>
            <CalendarDateRangePicker />
          </div>
          <div className="flex items-center space-x-2">
            <Button className="flex items-center space-x-2">
              <Download />
              <span>Download CSV</span>
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <NumberCard
            title="Formal"
            value={formalCapDevCount.toString()}
            icon={GraduationCap}
          />
          <NumberCard
            title="Informal"
            value={informalCapDevCount.toString()}
            icon={GraduationCap}
          />
        </div>

        <div className="mt-6">
          <TableCapDev programId={params.id} data={capDevs} />
        </div>
      </div>
    </div>
  );
}
