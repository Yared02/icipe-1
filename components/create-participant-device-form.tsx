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

export function CreateParticipantDeviceForm({
  participantId,
  onSuccess,
}: {
  participantId: string;
  onSuccess: () => void;
}) {
  const supabase = createClient();

  const [devices, setDevices] = useState<
    Database["public"]["Tables"]["devices"]["Row"][]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<string>();

  useEffect(() => {
    if (!searchTerm) return;
    search(searchTerm);
  }, [searchTerm]);

  const create = async () => {
    if (!selectedDevice) {
      toast.error("Please select a device");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.from("participant_devices").insert({
      participant_id: parseInt(participantId),
      device_id: parseInt(selectedDevice),
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    onSuccess();
  };

  const loadDevices = async (search: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("devices")
      .select()
      .ilike("name", `%${search}%`)
      .limit(5);
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    setDevices(data);

    return data;
  };

  const search = useCallback(debounce(loadDevices, 500), []);

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
        <RadioGroup onValueChange={(value) => setSelectedDevice(value)}>
          {devices?.map((device) => (
            <div key={device.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={device.id.toString()}
                id={device.id.toString()}
              />
              <Label htmlFor={device.id.toString()}>{device.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="col-span-12 flex items-end justify-end">
        <Button
          disabled={isLoading || !selectedDevice}
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
