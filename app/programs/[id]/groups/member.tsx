// import { useState, useEffect } from "react";
// import { createClient } from "@/utils/supabase/client";

// interface Participant {
//   firstname: string;
//   id: number;
// }

// export default function AddParticipants({ groupId }: { groupId: number }) {
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const supabase = createClient();

//     const fetchParticipants = async () => {
//       const { data, error } = await supabase.from("participants").select("name");
//       if (error) {
//         console.error("Error fetching participants:", error);
//       } else {
//         setParticipants(data);
//       }
//       setLoading(false);
//     };

//     fetchParticipants();
//   }, []);

//   const handleSelectParticipant = (participantId: number) => {
//     if (selectedParticipants.includes(participantId)) {
//       setSelectedParticipants(selectedParticipants.filter(id => id !== participantId));
//     } else {
//       setSelectedParticipants([...selectedParticipants, participantId]);
//     }
//   };

//   const handleSaveParticipants = async () => {
//     const supabase = createClient();

//     try {
//       // Insert selected participants into the `member` table
//       const insertData = selectedParticipants.map(participantId => ({
//         group_id: groupId,
//         participant_id: participantId,
//       }));

//       const { error } = await supabase.from("member").insert(insertData);

//       if (error) {
//         console.error("Error saving members:", error);
//         alert("Failed to save participants.");
//       } else {
//         alert("Participants added successfully.");
//       }
//     } catch (err) {
//       console.error("Unexpected error:", err);
//     }
//   };

//   if (loading) {
//     return <div>Loading participants...</div>;
//   }

//   return (
//     <div className="w-full p-4">
//       <h2>Select Participants for Group</h2>
//       <ul className="space-y-2">
//         {participants.map(participant => (
//           <li key={participant.id}>
//             <label>
//               <input
//                 type="checkbox"
//                 value={participant.id}
//                 checked={selectedParticipants.includes(participant.id)}
//                 onChange={() => handleSelectParticipant(participant.id)}
//               />
//               {participant.firstname}
//             </label>
//           </li>
//         ))}
//       </ul>
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
//         onClick={handleSaveParticipants}
//       >
//         Save Selected Participants
//       </button>
//     </div>
//   );
// }
