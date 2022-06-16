import { 
  Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, Typography } from "@mui/material";
import { addMinutes, format } from "date-fns";
import { FunctionComponent, useEffect, useState } from "react";
import { fetchSessionById, SessionDetail } from "../../api/records";
import InfoTextField from "../shared/InfoTextField";
import Loading from "../shared/Loading";

type Props = {
  sessionId: string | number | undefined;
  handleClose: () => void;
} & DialogProps;

const RecordDetail: FunctionComponent<Props> = ({ sessionId, handleClose, ...props }) => {
  const [session, setSession] = useState<SessionDetail | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let controller: AbortController | undefined;
    if (sessionId) {
      controller = new AbortController();
      setLoading(true);
      fetchSessionById(sessionId, controller)
        .then(({ data, error }) => {
          if (data && !error) setSession(data);
          else setError(error);
        })
        .finally(() => setLoading(false));
    }
    return () => {
      controller?.abort();
    }
  }, [sessionId]);

  const isAttended = session?.cancelled === "0";

  const renderSession = (session: SessionDetail) => {
    const [startH, startM] = session.startTime.split(":").map(m => +m);
    const startTime = addMinutes(new Date(session.startDate), startH * 60 + startM);

    return <>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        {session.name}
        <Chip label={isAttended ? "ATTENDED" : "CANCELLED"} color={isAttended ? "success" : "error"} />
      </DialogTitle>
      <DialogContent>

        <Typography sx={{ mt: 2, mb: 1 }}><strong>Mentee</strong></Typography>
        <InfoTextField value={session.mentee?.name} />
        <Typography sx={{ mt: 2, mb: 1 }}><strong>Session Group</strong></Typography>
        <InfoTextField value={session.sessionGroup?.name} />
        <Grid container sx={{ mt: 2 }} spacing={2}>
          <Grid item xs={12} sm={12} md={4}>
            <Typography sx={{ mb: 1 }}><strong>Start Date</strong></Typography>
            <InfoTextField value={format(startTime, "d MMM Y")} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Typography sx={{ mb: 1 }}><strong>Start Time</strong></Typography>
            <InfoTextField value={format(startTime, "hh:mm aa")} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Typography sx={{ mb: 1 }}><strong>Duration</strong></Typography>
            <InfoTextField value={session.duration} />
          </Grid>
        </Grid>
        <Typography sx={{ mt: 2, mb: 1 }}><strong>Notes</strong></Typography>
        <InfoTextField value={session.note} multiline minRows={3} />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleClose}>Close</Button>
      </DialogActions>
    </>
  }

  return <Dialog fullWidth maxWidth="md" onClose={handleClose} {...props}>
    {loading ? <Loading />
      : error && <Alert severity="error">{error}</Alert>}
    {session && renderSession(session)}
  </Dialog>
}

export default RecordDetail;