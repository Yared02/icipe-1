import * as React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  // const { data, error } = await supabase.auth.getUser();
  // if (error || !data?.user) {
  //   redirect("/login");
  // }
  return <>{children}</>;
}
