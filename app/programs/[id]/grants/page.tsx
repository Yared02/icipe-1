import { TableGrants } from "./table";
import { createClient } from "@/utils/supabase/server";
import { NumberCard } from "@/components/number-card";
import { HandCoins, Download } from "lucide-react";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { addDays, parseISO } from "date-fns";

export default async function GrantsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { search?: string; from?: string; to?: string };
}) {
  const supabase = createClient();

  const grantsQuery = supabase
    .from("grants")
    .select("*")
    .eq("program_id", params.id);

  if (searchParams?.search) {
    grantsQuery.textSearch("name", searchParams?.search);
  }

  if (searchParams?.from && searchParams.to) {
    grantsQuery.gte("created_at", parseISO(searchParams.from).toISOString());
    grantsQuery.lte(
      "created_at",
      addDays(parseISO(searchParams.to), 1).toISOString()
    );
  }

  const { data } = await grantsQuery;

  const { data: grantsCountQuery } = await supabase
    .from("grants")
    .select("count()")
    .eq("program_id", params.id);
  // @ts-ignore
  const grantsCount: number = grantsCountQuery?.at(0)?.count ?? 0;

  const grantsAmountSumQuery = await supabase
    .from("grants")
    .select("total_amount.sum()")
    .eq("program_id", params.id);

  const participantGrantsAmountSumQuery = await supabase
    .from("participant_grants")
    .select("amount.sum()")
    .eq("program_id", params.id);

  const totalAmountGranted: number =
    (grantsAmountSumQuery.data as any)?.at(0)?.sum ?? 0;

  const participantGrantsAmountSum: number =
    (participantGrantsAmountSumQuery?.data as any)?.at(0)?.sum ?? 0;

  const grants: Database["public"]["Tables"]["grants"]["Row"][] = data ?? [];

  return (
    <div className="p-8 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Grants</h2>

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
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          <NumberCard
            title="Grants"
            value={grantsCount?.toString() ?? "0"}
            icon={HandCoins}
          />
          <NumberCard
            title="Total Amount"
            value={`ETB ${new Intl.NumberFormat().format(totalAmountGranted)}`}
            icon={HandCoins}
          />
          <NumberCard
            title="Total Granted"
            value={`ETB ${new Intl.NumberFormat().format(
              participantGrantsAmountSum
            )}`}
            icon={HandCoins}
          />
        </div>

        <div className="mt-6">
          <TableGrants programId={params.id} data={grants} />
        </div>
      </div>
    </div>
  );
}
