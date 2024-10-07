"use client";
import { useEffect, useState } from "react";
import { ProgramListItem } from "@/components/program-list-item";
import { ProgramAddItem } from "@/components/program-add-item";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ahaxfqkzgbyovatyexfh.supabase.co"; // Replace with your Supabase URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYXhmcWt6Z2J5b3ZhdHlleGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwNzE2MzcsImV4cCI6MjAzMDY0NzYzN30.LmTYUkwy4buaCMAVZmS0_Wj9JS-EZpe75BebmGVWWn0"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the Program type based on your table structure
interface Program {
  id: string;
  name: string;
  // add other fields as necessary
}

export default function Index() {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      const programId = localStorage.getItem("id");

      if (programId) {
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .eq("created_by", programId);

        if (error) {
          console.error("Error fetching program:", error.message);
        } else if (data && data.length > 0) {
          // Set the first program if found
          setProgram(data[0]);
        }
      }
      setLoading(false);

    
    };

    fetchProgram();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-600">
      <div className="container mx-auto py-10 h-screen">
        <div className="grid grid-cols-2 gap-6 h-full animate-in">
          {program ? (
            <ProgramListItem id={program.id.toString()} title={program.name} />
          ) : (
            <ProgramAddItem />
          )}
        </div>
      </div>
    </div>
  );
}
