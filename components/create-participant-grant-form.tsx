"use client";

import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import debounce from "lodash/debounce";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const createParticipantGrantSchema = z.object({
  amount: z.number(),
});

export type CreateGrant = z.infer<typeof createParticipantGrantSchema>;

export function CreateParticipantGrantForm({
  grant,
  participantId,
  onSuccess,
}: {
  grant?: Database["public"]["Tables"]["grants"]["Row"];
  participantId?: string;
  onSuccess: () => void;
}) {
  const supabase = createClient();

  const [grants, setGrants] = useState<
    Database["public"]["Tables"]["grants"]["Row"][]
  >([]);
  const [participants, setParticipants] = useState<
    Database["public"]["Tables"]["participants"]["Row"][]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [grantSearchTerm, setGrantSearchTerm] = useState<string>();
  const [participantSearchTerm, setParticipantSearchTerm] = useState<string>();

  const [selectedParticipant, setSelectedParticipant] = useState<string>();
  const [selectedGrant, setSelectedGrant] = useState<string>();
  const [amount, setAmount] = useState<string>();

  const loadGrants = async (search: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("grants")
      .select()
      .ilike("name", `%${search}%`)
      .limit(5);
    setIsLoading(false);

    if (error) {
      console.log(error);
      toast.error("Failed to load grants");
      return;
    }

    setGrants(data);

    return data;
  };

  const loadParticipants = async (search: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("participants")
      .select()
      .textSearch("firstname_surname_phone", search)
      .limit(5);
    setIsLoading(false);

    if (error) {
      console.log(error);
      toast.error("Failed to load participants");
      return;
    }

    setParticipants(data);

    return data;
  };

  const grantSearch = useCallback(debounce(loadGrants, 500), []);
  const participantSearch = useCallback(debounce(loadParticipants, 500), []);

  useEffect(() => {
    if (!grantSearchTerm) return;
    grantSearch(grantSearchTerm);
  }, [grantSearchTerm]);

  useEffect(() => {
    if (!participantSearchTerm) return;
    participantSearch(participantSearchTerm);
  }, [participantSearchTerm]);

  useEffect(() => {
    if (!selectedGrant) return;

    const grant = grants.find((g) => g.id.toString() === selectedGrant);
    if (!grant) return;
    if (!grant.default_disbursement_amount) return;

    setAmount(grant.default_disbursement_amount.toString());
  }, [selectedGrant]);

  useEffect(() => {
    if (grant && grant.default_disbursement_amount) {
      setAmount(grant.default_disbursement_amount.toString());
      setSelectedGrant(grant.id.toString());
    }
  }, [grant]);

  const create = async () => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }

    if (!participantId && !selectedParticipant) {
      toast.error("Please select a participant");
      return;
    }

    const p = participantId || selectedParticipant;
    if (!p) {
      toast.error("Please select a participant");
      return;
    }

    if (!grant?.id && !selectedGrant) {
      toast.error("Please select a grant");
      return;
    }

    const g = grant?.id.toString() || selectedGrant;
    if (!g) {
      toast.error("Please select a grant");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.from("participant_grants").insert({
      participant_id: parseInt(p),
      grant_id: parseInt(g),
      amount: parseFloat(amount),
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    onSuccess();
  };

  return (
    <form className="grid grid-cols-12 gap-2">
      {!grant && (
        <div className="space-y-1 col-span-12">
          <div>
            <Input
              type="string"
              placeholder="Grant Search"
              onChange={(evt) => setGrantSearchTerm(evt.target.value.trim())}
            />
          </div>
          <div>
            <RadioGroup onValueChange={(value) => setSelectedGrant(value)}>
              {grants?.map((grant) => (
                <div key={grant.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={grant.id.toString()}
                    id={grant.id.toString()}
                  />
                  <Label htmlFor={grant.id.toString()}>{grant.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      )}
      {selectedGrant && (
        <div className="space-y-1 col-span-12">
          <div>
            <Label>Amount in ETB</Label>
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(evt) => setAmount(evt.target.value.trim())}
            />
          </div>
        </div>
      )}
      {!participantId && (
        <div className="space-y-1 col-span-12">
          <div className="space-y-1 col-span-12">
            <Input
              type="string"
              placeholder="Participant Search"
              onChange={(evt) =>
                setParticipantSearchTerm(evt.target.value.trim())
              }
            />
          </div>
          <div className="space-y-1 col-span-12">
            <RadioGroup
              onValueChange={(value) => setSelectedParticipant(value)}
            >
              {participants?.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={participant.id.toString()}
                    id={participant.id.toString()}
                  />
                  <Label
                    htmlFor={participant.id.toString()}
                  >{`${participant.firstname} ${participant.surname}`}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      )}

      <div className="col-span-12 flex items-end justify-end">
        <Button
          disabled={
            isLoading ||
            (!grant?.id && !selectedGrant) ||
            (!participantId && !selectedParticipant)
          }
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
