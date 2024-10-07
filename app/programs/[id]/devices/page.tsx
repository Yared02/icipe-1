import { TableDevices } from "./table";
import { createClient } from "@/utils/supabase/server";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { addDays, parseISO } from "date-fns";

export default async function DevicePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { search?: string; from?: string; to?: string };
}) {
  const supabase = createClient();

  const devicesQuery = supabase
    .from("devices")
    .select("*")
    .eq("program_id", params.id);

  if (searchParams?.search) {
    devicesQuery.textSearch("name", searchParams.search);
  }

  if (searchParams?.from && searchParams.to) {
    devicesQuery.gte("created_at", parseISO(searchParams.from).toISOString());
    devicesQuery.lte(
      "created_at",
      addDays(parseISO(searchParams.to), 1).toISOString()
    );
  }

  const { data } = await devicesQuery;

  const devices: Database["public"]["Tables"]["devices"]["Row"][] = data ?? [];

  return (
    <div className="p-8 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Assets</h2>

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

      <div className="mt-6">
        <TableDevices programId={params.id} data={devices} />
      </div>
    </div>
  );
}
