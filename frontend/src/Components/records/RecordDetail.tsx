import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid, TextField, Typography
} from "@mui/material";
import { addMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { FunctionComponent, useEffect, useState } from "react";
import { SessionDetail } from "../../api/records";
import useSessionDetail from "../../hooks/useSessionDetail";
import { TIMEZONE_ID } from "../../Utils/locale";
import InfoTextField from "../shared/InfoTextField";
import Loading from "../shared/Loading";

type Props = {
  sessionId?: string | number;
  handleClose: () => void;
} & DialogProps;

const RecordDetail: FunctionComponent<Props> = ({ sessionId, handleClose, ...props }) => {
  const [note, setNote] = useState("");
  const { session, isFetching, isLoading, isSubmitting, sessionError, updateNote } = useSessionDetail(sessionId);

  useEffect(() => {
    setNote(session?.note || "");
  }, [session?.note]);

  const renderSession = (session: SessionDetail) => {
    const [startH, startM] = session.startTime.split(":").map(m => +m);
    const startTime = addMinutes(new Date(session.startDate), startH * 60 + startM);
    const isAttended = session.cancelled === "0";

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
            <InfoTextField value={formatInTimeZone(startTime, TIMEZONE_ID, "do MMMM Y")} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Typography sx={{ mb: 1 }}><strong>Start Time</strong></Typography>
            <InfoTextField value={formatInTimeZone(startTime, TIMEZONE_ID, "hh:mm aa")} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Typography sx={{ mb: 1 }}><strong>Duration</strong></Typography>
            <InfoTextField value={session.duration} />
          </Grid>
        </Grid>
        <Typography sx={{ mt: 2, mb: 1 }}><strong>Notes</strong></Typography>
        <TextField
          name="note"
          value={note}
          onChange={(ev) => {
            setNote(ev.target.value);
          }}
          disabled={isFetching || isSubmitting}
          multiline
          minRows={3}
          fullWidth />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleClose}>Close</Button>
        <LoadingButton
          onClick={() => updateNote(note)}
          loading={isSubmitting || isFetching}
          disabled={!note || note === (session.note || "") || isFetching}
          variant="contained"
          color="primary">Update note</LoadingButton>
      </DialogActions>
    </>
  }

  return <Dialog fullWidth maxWidth="md" onClose={handleClose} {...props}>
    {isLoading && <Loading />}
    {!isLoading && (!session || sessionError) && <Alert severity="error"><AlertTitle>Someting gone wrong</AlertTitle>
      {sessionError} <br />
      Please refresh the page or contact the adminstrator
    </Alert>
    }
    {session && renderSession(session)}
  </Dialog>

}

export default RecordDetail;