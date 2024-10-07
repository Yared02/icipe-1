"use client"; 

import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

// Define the ParticipantData interface
interface ParticipantData {
  "Implementing partners": string;
  Clusters: string;
  Region: string;
  Woreda: string;
  "Participant Name": string;
  Sex: string;
  Age: number;
  "Phone Number": string;
  "Highest Education Level": string;
  "Marital status": string;
  "Do you have kids under 5 years old, under your care?": string;
  "Are you currently in breastfeeding?": string;
  // Add all other fields as necessary
}

export default function Home() {
  const [data, setData] = useState<ParticipantData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading

      try {
        const res = await fetch(`https://excel-ffile.onrender.com/parse-excel?page=${currentPage}&limit=20`);
        const json = await res.json();

        // Check if the data is an array before setting state
        if (Array.isArray(json.data)) {
          setData(json.data);
          setTotalPages(json.totalPages); // Update total pages
        } else {
          console.error('Unexpected response format: ', json);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData(); // Call the fetch function
  }, [currentPage]); // Dependency on currentPage

  return (
    <div className="container">
      <h1>Participant Data Table</h1>
      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color="#123abc" loading={loading} />
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          <table style={{ border: '1px solid black', width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '10px' }}>Implementing Partner</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Cluster</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Region</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Woreda</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Participant Name</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Sex</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Age</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Phone Number</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Education Level</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Marital Status</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Kids under 5?</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Breastfeeding?</th>
              </tr>
            </thead>
            <tbody>
              {data.map((participant, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant["Implementing partners"]}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant.Clusters}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant.Region}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant.Woreda}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant["Participant Name"]}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant.Sex}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant.Age}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant["Phone Number"]}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant["Highest Education Level"]}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant["Marital status"]}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant["Do you have kids under 5 years old, under your care?"]}</td>
                  <td style={{ border: '1px solid gray', padding: '10px' }}>{participant["Are you currently in breastfeeding?"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px' }}>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
              Previous
            </button>
            <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
