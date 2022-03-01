import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import { API_BASE_URL } from '../api/url';


export default function Records(){


  const [staffRecord, setStaffRecord] = useState([] as any[]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    fetch(`${API_BASE_URL}/records/` + localStorage.getItem('user_id'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
            },
            credentials: "include"
    })
    .then(response => response.json())
    .then((data) => {
      setStaffRecord(JSON.parse(data))
      setIsLoading(false)
    });
  }, []);


  const columns: GridColDef[] = [
    { field: 'Title', headerName: 'Session Title', width: 300 },
    { field: 'StartDate', headerName: 'Start Date', width: 300 },
    { field: 'Duration', headerName: 'Duration', width: 150 },
    { field: 'Status', headerName: 'Status', width: 150 },
    { field: 'Snippet', headerName: 'Note', width: 600 },
  ];


    return (
      <div>
        <h2>Records</h2>
        <div style={{ height: 700, width: '100%'}}>
          <DataGrid
            getRowId={(row) => row.SessionID}
            rows={staffRecord}
            columns={columns}
            pageSize={15}
            rowsPerPageOptions={[15, 25, 50, 100]}
            loading = {isLoading}
          />
        </div>
      </div>
    )
  };
  
 
