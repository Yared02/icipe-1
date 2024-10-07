"use client";

import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import { useEffect } from "react";

import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { createProgramAction } from "@/actions/create-program-action";
import { Button } from "./ui/button";
import { SheetFooter } from "./ui/sheet";

export function CreateProgramForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [state, action] = useFormState(createProgramAction, {
    message: "",
    success: false,
    submitted: false,
  });

  useEffect(() => {
    if (state.submitted && state.success) {
      onSuccess();
    }
  }, [state]);

  return (
    <form action={action} className="grid grid-cols-12 gap-4">
      <div className="space-y-1 col-span-12">
        <Label htmlFor="name">Name</Label>
        <Input required name="name" placeholder="Name" />
      </div>
      <SheetFooter className="space-y-1 col-span-12 flex items-center space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <SubmitButton />
      </SheetFooter>
    </form>
  );
}
