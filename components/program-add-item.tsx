"use client";

import { PlusIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateProgramForm } from "./create-program-form";

export function ProgramAddItem() {
  const router = useRouter();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleClick = () => {
    setIsCreateFormOpen(true);
  };

  const handleSuccess = () => {
    setIsCreateFormOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center justify-center h-full w-full bg-gray-500 shadow-md rounded-md p-4 transform transition-transform hover:scale-105 border-4 text-gray-300 border-dashed"
      >
        <div className="flex items-center mb-4">
          <div className="bg-gray-100 rounded-full p-3 mr-4">
            <PlusIcon className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            Add Program
          </h3>
        </div>
      </button>
      <Sheet open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
        <SheetContent className="min-w-[700px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Add Program</SheetTitle>
          </SheetHeader>
          <div className="py-2">
            <CreateProgramForm onSuccess={handleSuccess} onCancel={() => {}} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
