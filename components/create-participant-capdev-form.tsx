"use client";

import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import debounce from "lodash/debounce";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function CreateParticipantCapDevForm({
  participantId,
  programId,
  onSuccess,
}: {
  programId: string;
  participantId: string;
  onSuccess: () => void;
}) {
  const supabase = createClient();

  const [capDevs, setCapDevs] = useState<
    Database["public"]["Tables"]["capacity_developments"]["Row"][]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCapDev, setSelectedCapDev] = useState<string>();

  useEffect(() => {
    if (!searchTerm) return;
    search(searchTerm);
  }, [searchTerm]);

  const create = async () => {
    if (!selectedCapDev) {
      toast.error("Please select a device");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.from("participant_capdevs").insert({
      participant_id: parseInt(participantId),
      capacity_development_id: parseInt(selectedCapDev),
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    onSuccess();
  };

  const loadCapDevs = async (search: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("capacity_developments")
      .select()
      .eq("program_id", parseInt(programId))
      .ilike("name", `%${search}%`)
      .limit(5);
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    setCapDevs(data);

    return data;
  };

  const search = useCallback(debounce(loadCapDevs, 500), []);

  return (
    <form className="grid grid-cols-12 gap-4">
      <div className="space-y-1 col-span-12">
        <Input
          type="string"
          placeholder="Search"
          onChange={(evt) => setSearchTerm(evt.target.value.trim())}
        />
      </div>
      <div className="space-y-1 col-span-12">
        <RadioGroup onValueChange={(value) => setSelectedCapDev(value)}>
          {capDevs?.map((capDev) => (
            <div key={capDev.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={capDev.id.toString()}
                id={capDev.id.toString()}
              />
              <Label htmlFor={capDev.id.toString()}>{capDev.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="col-span-12 flex items-end justify-end">
        <Button
          disabled={isLoading || !selectedCapDev}
          type="button"
          onClick={() => create()}
        >
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </form>
  );
}
