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
import { disburseDeviceAction } from "@/actions/disburse-device-action";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/submit-button";
import { cn } from "@/lib/utils";

export function DisburseDeviceForm({
  selectedParticipants,
  onSuccess,
}: {
  selectedParticipants: number[];
  onSuccess: () => void;
}) {
  const supabase = createClient();

  const [allParticipantsCount, setAllParticipantsCount] = useState<number>();
  const [disburse, setDisburse] = useState<"all" | "selected">("all");

  const [state, action] = useFormState(disburseDeviceAction, {
    message: "",
    success: false,
    submitted: false,
    selectedParticipants: selectedParticipants,
  });

  const [devices, setDevices] = useState<
    Database["public"]["Tables"]["devices"]["Row"][]
  >([]);

  useEffect(() => {
    const getDevices = async () => {
      const { data, error } = await supabase.from("devices").select("*");

      if (error) {
        toast.error(error.message);
        return;
      }
      if (!data) return;

      setDevices(data);
    };

    getDevices();
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
    }
  }, [state]);

  return (
    <form action={action} className="grid grid-cols-12 gap-4">
      <div className="space-y-1 col-span-12">
        <Label htmlFor="device">Device</Label>
        <Select required name="deviceId">
          <SelectTrigger>
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            {devices.map((e) => (
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
          name="disburse"
          defaultValue="all"
          onValueChange={(value) => {
            setDisburse(value as "all" | "selected");
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
      {disburse === "all" && allParticipantsCount && (
        <div className="space-y-1 col-span-12">
          <p className="text-sm text-green-600">{`Disbursing device to ${allParticipantsCount} participant(s)`}</p>
        </div>
      )}
      {disburse === "selected" && (
        <div className="space-y-1 col-span-12">
          <p className="text-sm text-green-600">{`Disbursing device to ${selectedParticipants.length} participant(s)`}</p>
        </div>
      )}
      <div className="space-y-1 col-span-12">
        <SubmitButton />
      </div>
    </form>
  );
}
