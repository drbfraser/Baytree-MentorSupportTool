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
import { AxiosError } from "axios";
import { addMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { FunctionComponent, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { fetchSessionById, SessionDetail, updateNoteBySeesionId } from "../../api/records";
import { TIMEZONE_ID } from "../../Utils/locale";
import InfoTextField from "../shared/InfoTextField";
import Loading from "../shared/Loading";

type Props = {
  sessionId: string | number | undefined;
  handleClose: () => void;
} & DialogProps;

const generateMessage = (error?: AxiosError | null) => {
  const status = error?.response?.status;
  if (status === 404) return "Session detail not found";
  else "Cannot retrive session detail";
}

const RecordDetail: FunctionComponent<Props> = ({ sessionId, handleClose, ...props }) => {
  const { data, isLoading, error } = useQuery<SessionDetail | undefined, AxiosError>(["sessionDetail", sessionId], async ({ signal }) => {
    if (sessionId) {
      return await fetchSessionById(sessionId, signal);
    }
  });
  const errorMessage = generateMessage(error);

  // State for notes fields
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    setNote(data?.note || "");
    setTouched(false);
  }, [data?.note]);

  const handleUpdateNote = async () => {
    setSubmitting(true);
    if (sessionId) {
      const { error } = await updateNoteBySeesionId(sessionId, note);
      if (error) toast.error(`${error}. Please try again later`);
      else toast.success("Session note updated successfully");
    }
    else toast.error("No session ID provided. Please try again later");
    setSubmitting(false);
  }

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
            setTouched(true);
          }}
          multiline
          minRows={3}
          fullWidth />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleClose}>Close</Button>
        <LoadingButton
          loading={isSubmitting}
          type="submit"
          onClick={handleUpdateNote}
          disabled={!note || !touched}
          variant="contained"
          color="primary">Save changes</LoadingButton>
      </DialogActions>
    </>
  }

  return <Dialog fullWidth maxWidth="md" onClose={handleClose} {...props}>
    {isLoading ? <Loading />
      : errorMessage && <Alert severity="error">
        <AlertTitle>{errorMessage}</AlertTitle>
        Please refresh the page or contact the adminstrator
      </Alert>}
    {data && renderSession(data)}
  </Dialog>
}

export default RecordDetail;