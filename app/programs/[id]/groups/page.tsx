"use client"; // Mark this as a Client Component

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Use the client-side Supabase client
import { ConstructionIcon } from "lucide-react";
import { useRouter } from 'next/router'
import Link from 'next/link';

// Define your Group interface
interface Group {
  id: number;
  created_at: string;
  program_id: number;
  name: string;
  member: Array<{ [key: string]: any }>;
}

interface GroupsProps {
  params: {
    id: string;
  };
}

const Groups: React.FC<GroupsProps> = ({ params }) => {


  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [uniqueIdentifier, setUniqueIdentifier] = useState("");
  const [EnterpriseOwner, setEnterpriseOwner] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setsex] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [subpartner, setSubpartment] = useState("");
  const [totalNoYouthworkReported, settotalNoYouthworkReported] = useState("");
  const [NoYouthWorkWhoareRefugees, setNoYouthWorkWhoareRefugees] = useState("");
  const [NumberYouthWorkwhoIDPs, setNumberYouthWorkwhoIDPs] = useState("");
  const [NumberYouthWorkfromHostCommunities, setNumberYouthWorkfromHostCommunities] = useState("");
  const [NumberofYouthWorkwhoarePLWDs, setNumberofYouthWorkwhoarePLWDs] = useState("");
  const [Sector, setSector] = useState("");
  // const router = useRouter() // may be null or a NextRouter instance

  const [isSaving, setIsSaving] = useState(false); // For save button state

  useEffect(() => {
    const supabase = createClient(); // Initialize the client
    const userId=localStorage.getItem('id')

    // Function to fetch groups
    if(  userId){
    const fetchGroups = async () => {






      const { data, error } = await supabase
        .from("group") // Replace with your actual table name
        .select("*")
       .eq("created_by", userId)

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setGroups(data);
        console.log("Groups data:", data); // Log groups data
      }
      setLoading(false);
    };
  

    fetchGroups();
  }
  }, []);

  // Modal open handler
  const handleAddGroup = () => {
    setModalOpen(true);
  };

  // Modal close handler
  const handleCloseModal = () => {
    setModalOpen(false);
    setNewGroupName(""); // Reset the input when closing modal
  };

  // Handle form submission to save group
  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
  
    if (!newGroupName) {
      alert("Group name is required");
      setIsSaving(false);
      return;
    }
  
    const supabase = createClient();

    const userId=localStorage.getItem('id');
    if(userId){






  
    try {
      const { data, error } = await supabase.from("group").insert([
        {
          name: newGroupName,
          program_id: 1,
          created_by:userId,
          unique_identifier:uniqueIdentifier,
          enterprise_owner:EnterpriseOwner,
          dob:dob,
          sex:sex,
          type:type,
          size:size,
          subpartner:subpartner,
          totalNoYouthworkReported:totalNoYouthworkReported,
          NoYouthWorkWhoareRefugees:NoYouthWorkWhoareRefugees,
          NumberYouthWorkwhoIDPs:NumberYouthWorkwhoIDPs,
          NumberYouthWorkfromHostCommunities:NumberYouthWorkfromHostCommunities,
          NumberofYouthWorkwhoarePLWDs:NumberofYouthWorkwhoarePLWDs,
          Sector:Sector,

        },
      ]);
  
      if (error) {
        console.error("Error saving group:", error);
        alert("Failed to save group.");
      } else if (data) {
        // Check if data is not null
        setGroups((prevGroups) => [...prevGroups, ...data]);
      }
    } 
  
    
    catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSaving(false);
    }
  }
  };

  // const handleNavigate = (id: number) => {
  //   router.push(`/details/${id}`);
  // };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-200">
        <div className="flex items-center space-x-2 text-gray-400">
          <ConstructionIcon className="h-6 w-6" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-100 p-4">
      {/* Add Group Button */}
      <div className="flex justify-end mb-4 space-x-2">
  <button
    onClick={handleAddGroup}
    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"  >
    Add Group          
    


  </button>

</div>
      {/* Table Container */}
      <div className="overflow-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-200">
              <th className="border border-gray-300 p-3">ID</th>
              <th className="border border-gray-300 p-3">Created At</th>
              <th className="border border-gray-300 p-3">Program ID</th>
              <th className="border border-gray-300 p-3">Name</th>
              <th className="border border-gray-300 p-3">Add Member</th>
              <th className="border border-gray-300 p-3">View Member</th>

            </tr>
          </thead>
          <tbody>
          {groups.map((group) => (
          <tr key={group.id} className="even:bg-gray-100">
            <td className="border border-gray-300 p-3">{group.id}</td>
            <td className="border border-gray-300 p-3">
              {new Date(group.created_at).toLocaleString()}
            </td>
            <td className="border border-gray-300 p-3">{group.program_id}</td>
            <td className="border border-gray-300 p-3">{group.name}</td>
          
            <td className="border border-gray-300 p-3">
            <Link href={`/details/${group.id}`} className="bg-black text-white px-4 py-2 rounded">
  Add Members    
</Link>


            </td>

            <td className="border border-gray-300 p-3">
            <Link href={`/member/${group.id}`} className="bg-black text-white px-4 py-2 rounded">
  View Members
</Link>


            </td>
          </tr>
        ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Group */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-50">
        <div
          className="bg-white w-96 h-full p-6 shadow-lg transform transition-transform translate-x-full animate-slide-in-right overflow-y-auto" // Add 'overflow-y-auto'
          style={{ maxHeight: '80vh', animation: "slide-in-right 0.5s forwards" }} // Limit the height and enable scroll
        >
            <h2 className="text-xl font-bold mb-4">Add Group</h2>
            
            <form onSubmit={handleSaveGroup}>
  {/* Group Name Field */}
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">Group Name</label>
    <input
      type="text"
      value={newGroupName}
      onChange={(e) => setNewGroupName(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {/* Unique Identifier */}
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">Unique Identifier</label>
    <input
      type="text"
      value={uniqueIdentifier}
      onChange={(e) => setUniqueIdentifier(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Enterprise Owner */}
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">Enterprise Owner</label>
    <input
      type="text"
      value={EnterpriseOwner}
      onChange={(e) => setEnterpriseOwner(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Date of Birth */}
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">Owner Date of Birth</label>
    <input
      type="date"
      value={dob}
      onChange={(e) => setDob(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Sex */}
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">Sex</label>
    <input
      type="text"
      value={sex}
      onChange={(e) => setsex(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Type */}
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">Enterprise Type</label>
    <input
      type="text"
      value={type}
      onChange={(e) => setType(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Size */}
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">Enterprise Size</label>
    <input
      type="text"
      value={size}
      onChange={(e) => setSize(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Sub-partner */}
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">Name of Sub-partner</label>
    <input
      type="text"
      value={subpartner}
      onChange={(e) => setSubpartment(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Other fields... */}
  {/* Total Number of Youth in Work */}
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">
      Total Number of Youth in Work Reported
    </label>
    <input
      type="number"
      value={totalNoYouthworkReported}
      onChange={(e) => settotalNoYouthworkReported(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Add other fields similarly here... */}


  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">
    No of Youth Work Who are in Refugees    </label>
    <input
      type="number"
      value={NoYouthWorkWhoareRefugees}
      onChange={(e) => setNoYouthWorkWhoareRefugees(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">
    Number of Youth Work who IDPs   </label>
    <input
      type="number"
      value={NumberYouthWorkwhoIDPs}
      onChange={(e) => setNumberYouthWorkwhoIDPs(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">
    Number YouthWork from Host  Communities   </label>
    <input
      type="number"
      value={NumberYouthWorkfromHostCommunities}
      onChange={(e) => setNumberYouthWorkfromHostCommunities(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>


  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">
    Number of YouthWorkwhoare PLWDs   </label>
    <input
      type="number"
      value={NumberofYouthWorkwhoarePLWDs}
      onChange={(e) => setNumberofYouthWorkwhoarePLWDs(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium">
    Sector   </label>
    <input
      type="number"
      value={Sector}
      onChange={(e) => setSector(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={isSaving}
    className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${
      isSaving && "opacity-50 cursor-not-allowed"
    }`}
  >
    {isSaving ? "Saving..." : "Save"}
  </button>
</form>


            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal Slide-in CSS */}
      <style jsx>{`
        @keyframes slide-in-right {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
export default Groups;
