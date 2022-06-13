import { Alert, Box, Chip, Dialog, DialogContent, DialogProps, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { addMinutes, format } from "date-fns";
import { FunctionComponent, useEffect, useState } from "react";
import { fetchSessionById, SessionDetail } from "../../api/records";
import Loading from "../shared/Loading";

type Props = {
  sessionId: string | number | undefined;
} & DialogProps;

const RecordDetail: FunctionComponent<Props> = ({ sessionId, ...props }) => {
  const [session, setSession] = useState<SessionDetail | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionId) {
      setLoading(true);
      fetchSessionById(sessionId)
        .then(({ data, error }) => {
          if (data && !error) setSession(data);
          else setError(error);
        })
        .finally(() => setLoading(false));
    }
    return () => {
      console.log("Clean up")
      setLoading(false);
      setSession(undefined);
      setError("");
    }
  }, [sessionId]);

  const isAttended = session?.cancelled === "0";

  const renderSession = (session: SessionDetail) => {
    const [startH, startM] = session.startTime.split(":").map(m => +m);
    const startTime = addMinutes(new Date(session.startDate), startH * 60 + startM);

    return <>
      <DialogTitle sx={{display: "flex", justifyContent: "space-between"}}>
        {session.name}
        <Chip label={isAttended ? "ATTENDED" : "CANCELLED"} color={isAttended ? "success" : "error"} />
      </DialogTitle>
      <DialogContent>
        
          <Typography sx={{ mt: 2, mb: 1 }}><strong>Mentee</strong></Typography>
          <TextField fullWidth value={session.mentee?.name || ""} disabled />
          <Typography sx={{ mt: 2, mb: 1 }}><strong>Session Group</strong></Typography>
          <TextField fullWidth value={session.sessionGroup?.name || ""} disabled />
          <Grid container sx={{ mt: 2 }} spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              <Typography sx={{ mb: 1 }}><strong>Start Date</strong></Typography>
              <TextField fullWidth value={format(startTime, "d MMM Y")} disabled />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Typography sx={{ mb: 1 }}><strong>Start Time</strong></Typography>
              <TextField fullWidth value={format(startTime, "hh:mm aa")} disabled />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Typography sx={{ mb: 1 }}><strong>Duration</strong></Typography>
              <TextField fullWidth value={session.duration} disabled />
            </Grid>
          </Grid>
          <Typography sx={{ mt: 2, mb: 1 }}><strong>Notes</strong></Typography>
          <TextField fullWidth value={session.note || ""} disabled multiline minRows={3} />
      </DialogContent>
    </>
  }

  return <Dialog fullWidth maxWidth="md" {...props}>
    {loading ? <Loading />
      : error && <Alert severity="error">{error}</Alert>}
    {session && renderSession(session)}
  </Dialog>
}

export default RecordDetail;