import * as React from "react";
import { SideNav } from "./side-nav";
import { createClient } from "@/utils/supabase/server";
import { Header } from "./header";

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("programs")
    .select("name")
    .eq("id", params.id);

  const { data: participantsCount } = await supabase
    .from("participants")
    .select("count()");

  const { data: grantsCount } = await supabase.from("grants").select("count()");

  const { data: devicesCount } = await supabase
    .from("devices")
    .select("count()");

  const { data: capDevsCount } = await supabase
    .from("capacity_developments")
    .select("count()");

  const participants: number = (participantsCount as any)?.at(0)?.count ?? 0;
  const grants: number = (grantsCount as any)?.at(0)?.count ?? 0;
  const devices: number = (devicesCount as any)?.at(0)?.count ?? 0;
  const capDevs: number = (capDevsCount as any)?.at(0)?.count ?? 0;

  return (
    <div>
      <Header programId={params.id} />
      <div className="h-full items-stretch flex">
        <div className="border-r w-1/6">
          <SideNav
            id={params.id}
            programTitle={data?.at(0)?.name ?? ""}
            counts={{
              participants,
              grants,
              devices,
              capDevs,
            }}
          />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
