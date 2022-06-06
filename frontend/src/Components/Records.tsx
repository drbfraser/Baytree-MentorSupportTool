import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { fetchSessionListByMentorId, Session } from "../api/misc";
import { useAuth } from "../context/AuthContext";

export default function Records() {
  const { user } = useAuth();
  const [staffRecord, setStaffRecord] = useState([] as Session[]);
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
    fetchSessionListByMentorId(user!.userId)
      .then(setStaffRecord)
      .then(() => setIsLoading(false));
  }, []);

  const columns: GridColDef[] = [
    { field: "Title", headerName: "Session Title", width: 300 },
    { field: "StartDate", headerName: "Start Date", width: 300 },
    { field: "Duration", headerName: "Duration", width: 150 },
    { field: "Status", headerName: "Status", width: 150 },
    { field: "Snippet", headerName: "Note", width: 600 }
  ];

  return (
    <Box sx={{ minHeight: "100%" }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Records
      </Typography>
      <div style={{ width: "100%" }}>
        <DataGrid
          autoHeight
          getRowId={(row) => row.SessionID}
          rows={staffRecord}
          columns={columns}
          pageSize={15}
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
    </Box>
  );
}
