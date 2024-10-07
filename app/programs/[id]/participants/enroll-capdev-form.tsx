"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { enrollCapDevAction } from "@/actions/enroll-capdev-action";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/submit-button";
import { cn } from "@/lib/utils";

export function EnrollCapDevForm({
  selectedParticipants,
  onSuccess,
}: {
  selectedParticipants: number[];
  onSuccess: () => void;
}) {
  const supabase = createClient();

  const [allParticipantsCount, setAllParticipantsCount] = useState<number>();
  const [enroll, setEnroll] = useState<"all" | "selected">("all");

  const [state, action] = useFormState(enrollCapDevAction, {
    message: "",
    success: false,
    submitted: false,
    selectedParticipants: selectedParticipants,
  });

  const [capDevs, setCapDevs] = useState<
    Database["public"]["Tables"]["capacity_developments"]["Row"][]
  >([]);

  useEffect(() => {
    const getCapDevs = async () => {
      const { data, error } = await supabase
        .from("capacity_developments")
        .select("*");

      if (error) {
        toast.error(error.message);
        return;
      }
      if (!data) return;
      setCapDevs(data);
    };
    getCapDevs();
  }, []);

  useEffect(() => {
    const getParticipantsCount = async () => {
      const { count } = await supabase
        .from("participants")
        .select("id", { count: "exact" });

      if (count) {
        setAllParticipantsCount(count);
      }
    };

    getParticipantsCount();
  }, []);

  useEffect(() => {
    if (state.submitted && state.success) {
      onSuccess();
    } else {
      if (state.message) {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={action} className="grid grid-cols-12 gap-4">
      <div className="space-y-1 col-span-12">
        <Label htmlFor="capDevId">CapDev</Label>
        <Select required name="capDevId">
          <SelectTrigger>
            <SelectValue placeholder="CapDev" />
          </SelectTrigger>
          <SelectContent>
            {capDevs.map((e) => (
              <SelectItem key={e.id} value={e.id.toString()}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1 col-span-12">
        <Label htmlFor="participants">Participants</Label>
        <RadioGroup
          required
          name="enroll"
          defaultValue="all"
          onValueChange={(value) => {
            setEnroll(value as "all" | "selected");
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              disabled={selectedParticipants.length <= 0}
              value="selected"
              id="selected"
            />
            <Label
              className={cn({
                "text-gray-400": selectedParticipants.length <= 0,
              })}
              htmlFor="selected"
            >
              Selected
            </Label>
          </div>
        </RadioGroup>
      </div>
      {enroll === "all" && allParticipantsCount && (
        <div className="space-y-1 col-span-12">
          <p className="text-sm text-green-600">{`Enrolling ${allParticipantsCount} participant(s)`}</p>
        </div>
      )}
      {enroll === "selected" && (
        <div className="space-y-1 col-span-12">
          <p className="text-sm text-green-600">{`Enrolling ${selectedParticipants.length} participant(s)`}</p>
        </div>
      )}
      <div className="space-y-1 col-span-12">
        <SubmitButton />
      </div>
    </form>
  );
}
