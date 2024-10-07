"use server";

import { createClient } from "@/utils/supabase/server";

type FormState = {
  message: string;
  success: boolean;
  submitted: boolean;
  selectedParticipants: number[];
};

const supabase = createClient();

export async function disburseGrantAction(
  state: FormState,
  formData: FormData
) {
  const grantId = formData.get("grantId") as string;
  const disburse = formData.get("disburse") as string;
  const amount = formData.get("amount") as string;

  // Get the grant
  const grantQuery = await supabase
    .from("grants")
    .select("*")
    .eq("id", grantId);

  if (grantQuery.error) {
    return {
      message: grantQuery.error.message,
      success: false,
      submitted: true,
      selectedParticipants: state.selectedParticipants,
    };
  }

  const grant = grantQuery.data.at(0);
  if (!grant) {
    return {
      message: "Grant not found",
      success: false,
      submitted: true,
      selectedParticipants: state.selectedParticipants,
    };
  }

  if (disburse === "all") {
    // Get all participants
    const participantsQuery = await supabase.from("participants").select("*");
    if (participantsQuery.error) {
      return {
        message: participantsQuery.error.message,
        success: false,
        submitted: true,
        selectedParticipants: state.selectedParticipants,
      };
    }

    const participantIds = participantsQuery.data.map(
      (participant) => participant.id
    );

    await upsertParticipantGrants(participantIds, grant.id, parseInt(amount));

    return {
      message: "Form data processed",
      success: true,
      submitted: true,
      selectedParticipants: state.selectedParticipants,
    };
  } else if (disburse === "selected") {
    await upsertParticipantGrants(
      state.selectedParticipants,
      grant.id,
      parseInt(amount)
    );

    return {
      message: "Form data processed",
      success: true,
      submitted: true,
      selectedParticipants: state.selectedParticipants,
    };
  }

  return {
    message: "Something went wrong",
    success: false,
    submitted: true,
    selectedParticipants: state.selectedParticipants,
  };
}

async function upsertParticipantGrants(
  participantIds: number[],
  grantId: number,
  amount: number
) {
  for (const participantId of participantIds) {
    // Check if participant is already granted
    const participantGrantQuery = await supabase
      .from("participant_grants")
      .select("*")
      .eq("participant_id", participantId)
      .eq("grant_id", grantId);

    if (participantGrantQuery.error || participantGrantQuery.data.length > 0) {
      continue;
    }

    await supabase.from("participant_grants").insert({
      grant_id: grantId,
      participant_id: participantId,
      amount,
    });
  }
}
