import { Skeleton, Stack, Typography } from "@mui/material";
import { FunctionComponent } from "react";
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

  return sessionDetails === undefined ? (
    <Loading />
  ) : sessionDetails === null ? (
    <Typography>
      An error occurred when loading the session notes. Please try refreshing
      the page or contacting technical support.
    </Typography>
  ) : (
    <>
      {/* Date */}
      <Stack flexDirection="row">
        <Typography variant="h6" margin="1rem" minWidth="9rem">
          Date:
        </Typography>
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="body1">{sessionDetails.startDate}</Typography>
        </Stack>
      </Stack>

      {/* Start Time */}
      <Stack flexDirection="row">
        <Typography variant="h6" margin="1rem" minWidth="9rem">
          Start Time:
        </Typography>
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="body1">{sessionDetails.startTime}</Typography>
        </Stack>
      </Stack>

      {/* Duration */}
      <Stack flexDirection="row">
        <Typography variant="h6" margin="1rem" minWidth="9rem">
          Duration:
        </Typography>
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="body1">{sessionDetails.duration}</Typography>
        </Stack>
      </Stack>

      {/* Venue Name */}
      <Stack flexDirection="row">
        <Typography variant="h6" margin="1rem" minWidth="9rem">
          Venue Name:
        </Typography>
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="body1">{sessionDetails.venueName}</Typography>
        </Stack>
      </Stack>

      {/* Session Group */}
      <Stack flexDirection="row">
        <Typography variant="h6" margin="1rem" minWidth="9rem">
          Session Group:{" "}
        </Typography>
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="body1">
            {sessionDetails.sessionGroup.name}
          </Typography>
        </Stack>
      </Stack>

      {/* Activity */}
      <Stack flexDirection="row">
        <Typography variant="h6" margin="1rem" minWidth="9rem">
          Activity:
        </Typography>
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="body1">{sessionDetails.activity}</Typography>
        </Stack>
      </Stack>

      {/* Mentor Name */}
      <Stack flexDirection="row">
        <Typography variant="h6" margin="1rem" minWidth="9rem">
          Mentor Name:
        </Typography>
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="body1">{sessionDetails.mentor.name}</Typography>
        </Stack>
      </Stack>

      {/* Mentee Name */}
      <Stack flexDirection="row">
        <Typography variant="h6" margin="1rem" minWidth="9rem">
          Mentee Name:
        </Typography>
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="body1">
            {sessionDetails.mentee
              ? sessionDetails.mentee.name
              : "Not Available"}
          </Typography>
        </Stack>
      </Stack>

      {/* Notes */}
      <Typography
        variant="h5"
        marginTop="1rem"
        marginLeft="1rem"
        marginBottom="1rem"
      >
        Notes:
      </Typography>
      <Typography variant="body1" marginLeft="1rem">
        {sessionDetails.note}
      </Typography>
    </>
  );
};

const Loading: FunctionComponent = () => {
  return (
    <Stack margin="1rem">
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </Stack>
  );
};

export default MentorSessionsNotesModal;
