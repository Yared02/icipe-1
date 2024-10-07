"use server";

import { createClient } from "@/utils/supabase/server";

type FormState = {
  message: string;
  success: boolean;
  submitted: boolean;
  selectedParticipants: number[];
};

const supabase = createClient();

export async function enrollCapDevAction(state: FormState, formData: FormData) {
  const capDevId = formData.get("capDevId") as string;
  const enroll = formData.get("enroll") as string;

  // Get CapDev
  const capDevQuery = await supabase
    .from("capacity_developments")
    .select("*")
    .eq("id", capDevId);

  if (capDevQuery.error) {
    return {
      message: capDevQuery.error.message,
      success: false,
      submitted: true,
      selectedParticipants: state.selectedParticipants,
    };
  }

  const capDev = capDevQuery.data.at(0);
  if (!capDev) {
    return {
      message: "CapDev not found",
      success: false,
      submitted: true,
      selectedParticipants: state.selectedParticipants,
    };
  }

  if (enroll === "all") {
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

    await upsertParticipantCapDev(participantIds, capDev.id);

    return {
      message: "All participants enrolled",
      success: true,
      submitted: true,
      selectedParticipants: state.selectedParticipants,
    };
  } else if (enroll === "selected") {
    await upsertParticipantCapDev(state.selectedParticipants, capDev.id);

    return {
      message: "Selected participants enrolled",
      success: true,
      submitted: true,
      selectedParticipants: state.selectedParticipants,
    };
  }

  return {
    message: "Somethhing went wrong",
    success: false,
    submitted: true,
    selectedParticipants: state.selectedParticipants,
  };
}

async function upsertParticipantCapDev(
  participantIds: number[],
  capDevId: number
) {
  for (const participantId of participantIds) {
    // Check if participant is already enrolled
    const participantCapDevQuery = await supabase
      .from("participant_capdevs")
      .select("*")
      .eq("participant_id", participantId)
      .eq("capacity_development_id", capDevId);

    if (
      participantCapDevQuery.error ||
      participantCapDevQuery.data.length > 0
    ) {
      continue;
    }

    await supabase.from("participant_capdevs").insert({
      participant_id: participantId,
      capacity_development_id: capDevId,
    });
  }
}
