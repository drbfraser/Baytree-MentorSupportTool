import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { API_BASE_URL } from "../api/url";

export default function Records() {
  const [staffRecord, setStaffRecord] = useState([] as any[]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/records/${localStorage.getItem("user_id")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        setStaffRecord(JSON.parse(data));
        setIsLoading(false);
      });
  }, []);

  const columns: GridColDef[] = [
    { field: "Title", headerName: "Session Title", width: 300 },
    { field: "StartDate", headerName: "Start Date", width: 300 },
    { field: "Duration", headerName: "Duration", width: 150 },
    { field: "Status", headerName: "Status", width: 150 },
    { field: "Snippet", headerName: "Note", width: 600 }
  ];

  return (
    <div>
      <h2>Records</h2>
      <div style={{ height: 700, width: "100%" }}>
        <DataGrid
          getRowId={(row) => row.SessionID}
          rows={staffRecord}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15, 25, 50, 100]}
          loading={isLoading}
          onCellClick={(params: GridCellParams) => {
            setNote(params.row.Note);
            handleClickOpen();
          }}
        />
      </div>
      <Dialog open={open} onClose={handleClose} scroll="paper">
        <DialogTitle>Note:</DialogTitle>
        <DialogContent>
          <DialogContentText>{note}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
