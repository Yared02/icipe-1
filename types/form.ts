import { z } from "zod";

export const createParticipantSchema = z.object({
  firstname: z.string(),
  surname: z.string(),
  age: z.string(),
  gender: z.string(),
  education_level: z.string(),
  martial_status: z.string(),
  region: z.string(),
  woreda: z.string(),
  kebele: z.string(),
  zone: z.string(),
  phone: z.string(),
});

export type CreateParticipant = z.infer<typeof createParticipantSchema>;

export const createCapacityDevelopmentSchema = z.object({
  name: z.string(),
  total_participant_capacity: z.string(),
  type: z.string(),
  from: z.string(),
  to: z.string(),
  status: z.string(),
});

export type CreateCapacityDevelopment = z.infer<
  typeof createCapacityDevelopmentSchema
>;

export const createDeviceSchema = z.object({
  name: z.string(),
  amount: z.string(),
  operating_system: z.string(),
  model: z.string(),
  type: z.string(),
});

export type CreateDevice = z.infer<typeof createDeviceSchema>;

export const createProgramSchema = z.object({
  name: z.string(),
});

export type CreateProgram = z.infer<typeof createProgramSchema>;