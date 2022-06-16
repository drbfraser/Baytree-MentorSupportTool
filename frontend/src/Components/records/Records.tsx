import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { addMinutes, format } from "date-fns";
import { FunctionComponent, ReactText, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchSessions, SessionRecord } from "../../api/records";
import Loading from "../shared/Loading";
import RecordDetail from "./RecordDetail";

const RecordRow: FunctionComponent<{ session: SessionRecord, handleClick: () => void }> = ({ session, handleClick }) => {
  const [startH, startM] = session.startTime.split(":").map(m => +m);
  const startTime = addMinutes(new Date(session.startDate), startH * 60 + startM);

  return <TableRow hover onClick={handleClick}>
    <TableCell>{session.name}</TableCell>
    <TableCell>{format(startTime, "d MMM Y")}</TableCell>
    <TableCell>{format(startTime, "hh:mm aa")}</TableCell>
    <TableCell>{session.duration}</TableCell>
    <TableCell align="center">
      {+session.cancelled !== 0
        ? <Chip label="CANCELLED" size="small" color="error" />
        : <Chip label="ATTENDED" size="small" color="success" />}
    </TableCell>
  </TableRow>
}

export default function Records() {
  // Records
  const [sessions, setSessions] = useState([] as SessionRecord[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Record dialog
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | number | undefined>(undefined);

  useEffect(() => {
    fetchSessions()
      .then(({ data, error }) => {
        if (data && !error) setSessions(data);
        else setError(error);
      })
      .then(() => setLoading(false));
  }, []);

  // Give the error toast when failure
  useEffect(() => {
    let toastId: ReactText;
    if (error) toastId = toast.error(error);
    return () => {
      if (toastId) toast.dismiss(toastId);
    }
  }, [error]);

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Records
      </Typography>
      <TableContainer component={Paper} sx={{ overflow: "auto" }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Session Title</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <TableRow>
              <TableCell colSpan={5}><Loading /></TableCell>
            </TableRow>}
            {sessions.length === 0 && !loading && <TableRow>
              <TableCell colSpan={5} align="center">No records found</TableCell>
            </TableRow>}
            {sessions.map(session => {
              return <RecordRow 
                session={session} 
                key={session.viewsSessionId}
                handleClick={() => {
                  setSessionId(session.viewsSessionId);
                  setOpen(true);
                }} />
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {open && <RecordDetail sessionId={sessionId} open={open} handleClose={() => setOpen(false)} />}
    </>
  );
}
