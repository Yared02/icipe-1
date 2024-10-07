"use client"; // Add this line at the top

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ahaxfqkzgbyovatyexfh.supabase.co"; // Replace with your Supabase URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYXhmcWt6Z2J5b3ZhdHlleGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUwNzE2MzcsImV4cCI6MjAzMDY0NzYzN30.LmTYUkwy4buaCMAVZmS0_Wj9JS-EZpe75BebmGVWWn0"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Participant {
  id: string;
  firstname: string | null;
  lastname: string | null;
  age: number | null;
  phone: string | null;
  gender: string | null;
}

const DetailPage: React.FC = () => {
  const { id } = useParams(); // Retrieve the ID from the URL
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  ); // Store selected participant IDs

  // Fetch participants from Supabase
  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("participants") // Replace with your Supabase table name
        .select("*");

      if (error) {
        console.error("Error fetching participants:", error.message);
      } else {
        setParticipants(data || []);
      }
      setLoading(false);
    };

    fetchParticipants();
  }, [id]);

  // Search logic: Ensure we handle null or undefined values for both `firstname` and `lastname`
  const filteredParticipants = participants.filter(
    (participant) =>
      (participant.firstname?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (participant.lastname?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  // Pagination logic (if needed)
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredParticipants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredParticipants.length / recordsPerPage);

  // Checkbox logic for selecting participants
  const handleCheckboxChange = (id: string) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(
        selectedParticipants.filter((participantId) => participantId !== id)
      );
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  // Register selected participants to member table
  const registerSelectedParticipants = async () => {
    const selected = participants.filter((participant) =>
      selectedParticipants.includes(participant.id)
    );
    for (const participant of selected) {
      const { error } = await supabase.from("member").insert([
        {
          participant_id: participant.id,
          firstname: participant.firstname,
          lastname: participant.lastname,
          group_id: id, // Using the `useParams` ID
        },
      ]);
      if (error) {
        console.error("Error inserting into member table:", error.message);
      }
    }
    alert("Selected participants registered successfully!");
    setSelectedParticipants([]); // Clear selected participants after registration
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Participants</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by first or last name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "100%",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      {/* Table for participants */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Select</th>
            <th style={tableHeaderStyle}>ID</th>
            <th style={tableHeaderStyle}>First Name</th>
            <th style={tableHeaderStyle}>Last Name</th>
            <th style={tableHeaderStyle}>Gender</th>
            <th style={tableHeaderStyle}>Phone</th>
            <th style={tableHeaderStyle}>Age</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((participant) => (
            <tr key={participant.id}>
              <td style={tableCellStyle}>
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(participant.id)}
                  onChange={() => handleCheckboxChange(participant.id)}
                />
              </td>
              <td style={tableCellStyle}>{participant.id}</td>
              <td style={tableCellStyle}>
                {participant.firstname || "N/A"} {/* Handle null values */}
              </td>
              <td style={tableCellStyle}>
                {participant.lastname || "N/A"} {/* Handle null values */}
              </td>
              <td style={tableCellStyle}>
                {participant.gender || "N/A"} {/* Handle null values */}
              </td>
              <td style={tableCellStyle}>
                {participant.phone || "N/A"} {/* Handle null values */}
              </td>
              <td style={tableCellStyle}>
                {participant.age !== null ? participant.age : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={paginationButtonStyle}
        >
          Previous
        </button>
        <p style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={paginationButtonStyle}
        >
          Next
        </button>
      </div>

      {/* Button to register selected participants */}
      <button
        onClick={registerSelectedParticipants}
        disabled={selectedParticipants.length === 0}
        style={registerButtonStyle}
      >
        Register Selected Participants
      </button>
    </div>
  );
};

// Styles
const tableHeaderStyle = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
  backgroundColor: "#f4f4f4",
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const paginationButtonStyle = {
  padding: "8px 16px",
  margin: "0 5px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const registerButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "20px",
};

export default DetailPage;
