"use client";

import { useState, ComponentPropsWithoutRef, useEffect } from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import HiveIcon from "./hive.svg";
import { useRouter } from "next/navigation";
import { CreateProgramForm } from "./create-program-form";

type Program = Database["public"]["Tables"]["programs"]["Row"];

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface ProgramSwitcherProps extends PopoverTriggerProps {
  programId: string;
  programs: Program[];
}

export default function ProgramSwitcher({
  programs,
  className,
  programId,
}: ProgramSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showNewProgramDialog, setShowNewProgramDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program>();

  useEffect(() => {
    if (programId && programs.length > 0) {
      const program = programs.find(
        (program) => program.id.toString() === programId
      );
      if (program) setSelectedProgram(program);
    }
  }, [programId, programs]);

  const handleSelect = (program: Program) => {
    setSelectedProgram(program);
    setOpen(false);

    router.push(`/programs/${program.id}`);
  };

  const handleCreateProgram = () => {
    setOpen(false);
    setShowNewProgramDialog(true);
  };

  const handleProgramCreated = () => {
    setShowNewProgramDialog(false);
    router.refresh();
  };

  return (
    <Sheet open={showNewProgramDialog} onOpenChange={setShowNewProgramDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-full justify-between", className)}
          >
            <Image
              src={HiveIcon}
              alt="Qena"
              width="20"
              height="20"
              className="mr-2 text-yellow-600"
            />

            {selectedProgram?.name ?? ""}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[330px] shadow-lg p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search program..." />
              <CommandEmpty>No program found.</CommandEmpty>
              <CommandGroup key={"Programs"} heading={"Programs"}>
                {programs.map((program) => (
                  <CommandItem
                    key={program.id}
                    onSelect={() => {
                      handleSelect(program);
                    }}
                    className="text-sm"
                  >
                    <Image
                      src={HiveIcon}
                      alt="Qena"
                      width="20"
                      height="20"
                      className="mr-2 text-yellow-600"
                    />
                    {program.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedProgram?.id === program.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <SheetTrigger asChild>
                  <CommandItem onSelect={handleCreateProgram}>
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Program
                  </CommandItem>
                </SheetTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <SheetContent className="min-w-[700px] overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Create program</SheetTitle>
        </SheetHeader>
        <div className="py-2">
          <CreateProgramForm
            onSuccess={handleProgramCreated}
            onCancel={() => setShowNewProgramDialog(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
