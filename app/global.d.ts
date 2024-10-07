import { Database as DB } from "@/types/supabase";

type Participant = Database["public"]["Tables"]["participants"]["Row"];
type Grant = Database["public"]["Tables"]["grants"]["Row"];

declare global {
  type Database = DB;
  type Participant = Participant;
  type Grant = Grant;
  type BusinessWithParticipant =
    Database["public"]["Tables"]["businesses"]["Row"] & {
      firstname: string;
      surname: string;
    };
  type ParticipantGrantWithParticipant =
    Database["public"]["Tables"]["participant_grants"]["Row"] & {
      participant: Database["public"]["Tables"]["participants"]["Row"];
    };
}
