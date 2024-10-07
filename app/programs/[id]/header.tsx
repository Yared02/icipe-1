"use client"
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";
import ProgramSwitcher from "@/components/program-switcher";
import { ThemeSelector } from "@/components/theme-selector";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import IcipeIcon from "./logo.jpg";
import IIRR from "./IIRR.png";
import { useEffect, useState } from "react";

export  function Header({ programId }: { programId: string }) {
  const supabase = createClient();
  // const { data: programs } = await supabase.from("programs").select("*");

  const [organization, setOrganization] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrganization = localStorage.getItem("organization");
      setOrganization(storedOrganization);
    }
  }, []);

  const isIIRR = organization === "IIRR";

  return (
    <header className={`flex items-center h-16 border-b shrink-0 'bg-white'}`}>
      <div className="w-1/6 border-r h-full flex items-center justify-center px-2">
        <Image
          src={isIIRR ? IIRR : IcipeIcon} // Use IIRR logo if organization is "IIRR"
          alt="Logo"
          width="100"
          height="15"
          className="object-contain"
        />
      </div>
      <div className="flex-1 flex justify-between">
        {/* <div className="px-3 w-[300px]">
          <ProgramSwitcher programId={programId} programs={programs ?? []} />
        </div> */}
        <nav className="ml-auto flex items-center gap-4 px-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <BellIcon />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MailIcon />
            <span className="sr-only">Messages</span>
          </Button>
          <ThemeSelector />
          <UserNav />
        </nav>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg
      className="w-5 h-5"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className="w-5 h-5"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
