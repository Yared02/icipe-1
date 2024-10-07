"use server";

import { createClient } from "@/utils/supabase/server";

type FormState = {
  message: string;
  success: boolean;
  submitted: boolean;
};

const supabase = createClient();

export async function createProgramAction(_: FormState, formData: FormData) {
  const name = formData.get("name") as string;

  const { error } = await supabase.from("programs").insert({
    name,
  });

  if (error) {
    return {
      message: error.message,
      success: false,
      submitted: true,
    };
  }

  return {
    message: "Program created",
    success: true,
    submitted: true,
  };
}
