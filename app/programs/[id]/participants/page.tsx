'use client';

import { createClient } from "@/utils/supabase/client";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { TableParticipants } from "./table-participants";
import { addDays, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function ParticipantPage({
  searchParams,
  params,
}: {
  params: { id: string };
  searchParams?: {
    search?: string;
    gender?: string;
    from?: string;
    to?: string;
  };
}) {
  const supabase = createClient();

  const [attributes, setAttributes] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    id: 0,
  });

  const [participants, setParticipants] = useState<any[]>([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [businessesCount, setBusinessesCount] = useState(0);

  // Fetch `localStorage` values on component mount
  useEffect(() => {
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    const email = localStorage.getItem("email");
    const id = localStorage.getItem("id");

    setAttributes({
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      id: id || "",
    });
  }, []);

  // Fetch participants and counts after `attributes.id` is set
  useEffect(() => {
    async function fetchData() {
      if (!attributes.id) return; // Make sure id is set before fetching data

      const participantsQuery = supabase
        .from("participants")
        .select("*")
        .eq("created_by", attributes.id)
        // .eq("program_id", params.id);


      if (searchParams?.gender) {
        participantsQuery.eq("gender", searchParams.gender);
      }
      if (searchParams?.search) {
        participantsQuery.ilike("firstname", `%${searchParams.search}%`);
      }
      


      if (searchParams?.from && searchParams?.to) {
        participantsQuery.gte(
          "created_at",
          parseISO(searchParams.from).toISOString()
        );
        participantsQuery.lte(
          "created_at",
          addDays(parseISO(searchParams.to), 1).toISOString()
        );
      }

      const { data: participantsData } = await participantsQuery;
      setParticipants(participantsData || []);

      const { count: participantsCountData } = await supabase
        .from("participants")
        .select("id", { count: "exact" })
        .eq("program_id", params.id);
      setParticipantsCount(participantsCountData || 0);

      const { count: businessesCountData } = await supabase
        .from("businesses")
        .select("id", { count: "exact" })
        .eq("program_id", params.id);
      setBusinessesCount(businessesCountData || 0);
    }

    fetchData();
  }, [attributes.id, searchParams, params.id]); // Trigger the effect when id or params change

  return (
    <div className="p-8 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Participants</h2>

        <div className="flex items-center space-x-3">
          <CalendarDateRangePicker />
          <Button className="bg-black-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            <Download />
            <span>Download CSV {attributes.id}</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Example of NumberCard components for stats */}
        {/* 
        <NumberCard
          title="Participants"
          value={participantsCount.toString()}
          icon={Users2}
        />
        <NumberCard
          title="Businesses"
          value={businessesCount.toString()}
          icon={BriefcaseBusiness}
        />
        */}
      </div>

      <div className="mt-6">
        <TableParticipants programId={params.id} data={participants} />
      </div>
    </div>
  );
}
