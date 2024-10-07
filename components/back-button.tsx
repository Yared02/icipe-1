"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button type="button" variant="ghost" onClick={() => router.back()}>
      <ChevronLeft className="w-6 h-6" />
    </Button>
  );
}
