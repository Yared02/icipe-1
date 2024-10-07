"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function UserNav() {
  const router = useRouter();
  const supabase = createClient();

  const [attributes, setAttributes] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    // Retrieve stored user data from localStorage
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    const email = localStorage.getItem("email");

    // Update state with the retrieved values
    setAttributes({
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
    });
  }, []); // Run only once when the component mounts

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Clear localStorage on sign out
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      localStorage.removeItem("email");
      localStorage.removeItem("phone_no");
      localStorage.removeItem("organization");
      router.replace("/login");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {attributes.firstName &&
                attributes.lastName &&
                `${attributes.firstName[0]}${attributes.lastName[0]}`}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {attributes.firstName && attributes.lastName
                ? `${attributes.firstName} ${attributes.lastName}`
                : "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {attributes.email || "No email"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
