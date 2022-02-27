import React, { useState } from "react";
import "./css/records.css";


export default function Records(){


  const [staffRecord, setStaffRecord] = useState([] as any[]);

  fetch('http://localhost:8000/records/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
          },
          credentials: "include"
      })
      .then(response => response.json())
      .then((data) => {
        setStaffRecord(JSON.parse(data))
        console.log(staffRecord)
      });
  
    return (
      <div>
        <h2>Records</h2>
        <table>
                <thead>
                    <tr>
                    <th>Session Title</th>
                    <th>Start Date</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                {staffRecord.map((record)=>{
                    return(
                      <tr>
                        <td>{record.Title}</td>
                        <td>{record.StartDate}</td>
                        <td>{record.Duration}</td>
                        <td>{record.Status}</td>
                        <td>{record.Snippet}</td>
                      </tr>
                    );
                   }
                  )}    
                </tbody>
        </table>
      </div>
    )
  };
  
 
