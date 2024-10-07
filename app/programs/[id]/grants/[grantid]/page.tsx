import { createClient } from "@/utils/supabase/server";
import { TableParticipants } from "./table-participants";
import { NumberCard } from "@/components/number-card";
import { HandCoins } from "lucide-react";
import { BackButton } from "@/components/back-button";

export interface Filters {
  disbursementStatus: "beneficiary" | "nonbeneficiary";
}
export default async function GrantPage({
  params,
}: {
  params: { grantid: string };
  searchParams: { disbursement: string };
}) {
  const supabase = createClient();

  const grantQuery = await supabase
    .from("grants")
    .select("*")
    .eq("id", params.grantid);
  const grant: Database["public"]["Tables"]["grants"]["Row"] | null =
    grantQuery?.data?.at(0) ?? null;

  // Participant grants count
  const { data: participantGrantsCount } = await supabase
    .from("participant_grants")
    .select("count()");
  // @ts-ignore
  const totalParticipants: number = participantGrantsCount?.at(0)?.count ?? 0;

  // Participants with grant
  const { data: participantGrants } = await supabase
    .from("participant_grants")
    .select(
      "*,participant:participant_id(firstname,surname,gender,region,phone)"
    )
    .eq("grant_id", params.grantid);

  const participants: ParticipantGrantWithParticipant[] =
    participantGrants?.map((e) => ({
      ...e,
      participant: e.participant as Participant,
    })) ?? [];

  return (
    <div className="py-6">
      <div className="">
        <div className="flex items-center space-x-2">
          <BackButton />
          <div>
            <h2 className="text-2xl font-bold">{grant?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {grant?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="px-16 mt-4">
        <div className="mr-6 grid grid-cols-3 gap-4 ">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Start Date</p>
            <p className="text-lg font-bold">{grant?.from}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">End Date</p>
            <p className="text-lg font-bold">{grant?.to}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Status</p>
            <p className="text-lg font-bold text-green-500">{grant?.status}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4 mt-4">
          <NumberCard
            title="Amount"
            value={`ETB ${new Intl.NumberFormat().format(
              grant?.total_amount ?? 0
            )}`}
            icon={HandCoins}
          />
          <NumberCard
            title="Disbursed"
            value={`ETB ${new Intl.NumberFormat().format(
              grant?.default_disbursement_amount ?? 0
            )}`}
            icon={HandCoins}
          />
          <NumberCard
            title="Per Person"
            value={`ETB ${new Intl.NumberFormat().format(
              grant?.default_disbursement_amount ?? 0
            )}`}
            icon={HandCoins}
          />
          <NumberCard
            title="Receipients"
            value={new Intl.NumberFormat().format(totalParticipants ?? 0)}
            icon={HandCoins}
          />
        </div>

        <div className="mt-4">
          {grant && (
            <TableParticipants grant={grant} data={participants ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}
