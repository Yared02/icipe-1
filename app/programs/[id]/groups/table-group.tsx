// interface Group {
//     id: ;
//     program_id: number;
//     name: Text;
//     member?: Array<{ [key: string]: any }>; // The member is an array of objects
//   }
  
//   export const TableParticipants = ({ data }: { data: Group[] }) => {
//     return (
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead>
//           <tr>
//             <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Program ID
//             </th>
//             <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Name
//             </th>
//             <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               ID
//             </th>
//             <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Members
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {data.map((group) => (
//             <tr key={group.id}>
//               <td className="px-6 py-4 whitespace-nowrap">{group.program_id}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{group.name}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{group.id}</td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 {/* Check if members exist */}
//                 {group.member && group.member.length > 0 ? (
//                   group.member.map((member, index) => (
//                     <div key={index}>
//                       {/* Display all properties of the member object */}
//                       {Object.entries(member).map(([key, value], i) => (
//                         <p key={i}>
//                           <strong>{key}:</strong> {value}
//                         </p>
//                       ))}
//                     </div>
//                   ))
//                 ) : (
//                   <p>No members available</p>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };
  