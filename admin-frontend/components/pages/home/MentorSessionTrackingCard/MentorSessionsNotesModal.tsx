import { Skeleton, Typography } from "@mui/material";
import { FunctionComponent, useEffect } from "react";
import { toast } from "react-toastify";
import { Session } from "../../../../api/backend/views/sessions";
import useSessionDetails from "../../../../hooks/useSessionDetails";

export interface MentorSessionsNotesModalProps {
  session: Session;
}

const MentorSessionsNotesModal: React.FunctionComponent<
  MentorSessionsNotesModalProps
> = (props) => {
  const { sessionDetails } = useSessionDetails(
    parseInt(props.session.viewsSessionId)
  );

  useEffect(() => {
    if (sessionDetails === undefined) {
      // skip initial useEffect on first component render
      return;
    } else if (sessionDetails === null) {
      // an error occurred when getting the session details
      toast.error(
        "An error occurred when loading the session notes. Please try refreshing the page or contacting technical support."
      );
    } else {
    }
  }, [sessionDetails]);

  return sessionDetails === undefined ? (
    <Loading />
  ) : sessionDetails === null ? (
    <Typography>
      An error occurred when loading the session notes. Please try refreshing
      the page or contacting technical support.
    </Typography>
  ) : (
    <>
      <Typography>Mentee Name: {sessionDetails.mentee?.name}</Typography>
      <Typography>Notes:</Typography>
      <br />
      <Typography variant="body1">{sessionDetails.note}</Typography>
    </>
  );
};

const Loading: FunctionComponent = () => {
  return (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  );
};

export default MentorSessionsNotesModal;
