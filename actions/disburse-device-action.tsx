"use server";

import { createClient } from "@/utils/supabase/server";

type FormState = {
  message: string;
  success: boolean;
  submitted: boolean;
  selectedParticipants: number[];
};

const supabase = createClient();

export async function disburseDeviceAction(
  state: FormState,
  formData: FormData
) {
  const deviceId = formData.get("deviceId") as string;
  const disburse = formData.get("disburse") as string;

  // Get the device
  const deviceQuery = await supabase
    .from("devices")
    .select("*")
    .eq("id", deviceId);

  if (deviceQuery.error) {
    return {
      message: deviceQuery.error.message,
      success: false,
      submitted: true,
      selectedParticipants: state.selectedParticipants,
    };
  }

  const device = deviceQuery.data.at(0);
  if (!device) {
    return {
      message: "Device not found",
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

    await upsertParticipantDevices(participantIds, device.id);

    return {
      message: "Device successfully disbursed to all participants",
      success: true,
      submitted: true,
      selectedParticipants: state.selectedParticipants,
    };
  } else if (disburse === "selected") {
    await upsertParticipantDevices(state.selectedParticipants, device.id);

    return {
      message: "Device successfully disbursed to selected participants",
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

async function upsertParticipantDevices(
  participantIds: number[],
  deviceId: number
) {
  for (const participantId of participantIds) {
    // Check if participant is already granted
    const participantDeviceQuery = await supabase
      .from("participant_devices")
      .select("*")
      .eq("participant_id", participantId)
      .eq("device_id", deviceId);

    if (
      participantDeviceQuery.error ||
      participantDeviceQuery.data.length > 0
    ) {
      continue;
    }

    await supabase.from("participant_devices").insert({
      participant_id: participantId,
      device_id: deviceId,
    });
  }
}
