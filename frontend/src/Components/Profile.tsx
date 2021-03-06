import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle, Stack, Typography } from "@mui/material";
import { formatDistanceToNowStrict } from "date-fns";
import useMentees from "../hooks/useMentees";
import useMentor from "../hooks/useMentor";
import InfoTextField from "./shared/InfoTextField";
import Loading from "./shared/Loading";
import TitledContainer from "./shared/TitledContainer";


const Profile = () => {
  const { loadingMentor, mentor, error: mentorError } = useMentor();
  let { mentees, loadingMentees } = useMentees();
  const loading = loadingMentor || loadingMentees;

  if (loading) return <Loading />;
  let error = mentorError;

  if (error || !mentees) {
    if (!error && !mentees) error = "Cannot retrieve active mentees";
    return <TitledContainer title="Profile">
      <Alert severity="error" sx={{my: 2}}>
        <AlertTitle>{error}</AlertTitle>
        Please try again or contact the adminstrator.
      </Alert>
    </TitledContainer>
  }

  return <TitledContainer title="Profile">
    <Typography sx={{ mt: 2, mb: 1 }} variant="h6">Name</Typography>
    <InfoTextField value={`${mentor.firstname} ${mentor.surname}`} />
    <Typography sx={{ mt: 2, mb: 1 }} variant="h6">Email</Typography>
    <InfoTextField value={mentor.email} />
    <Typography sx={{ mt: 2, mb: 1 }} variant="h6">
      <strong>{mentees.length > 0 ? "Mentees" : "No mentees assigned"}</strong>
    </Typography>
    {mentees.map(mentee => <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <strong>{`${mentee.firstName} ${mentee.lastName}`}</strong>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1}>
          <div>
            <Typography variant="subtitle1">Email</Typography>
            <Typography variant="subtitle2">
              {mentee.email}
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle1">Age</Typography>
            <Typography variant="subtitle2">
              {mentee.dateOfBirth === "0000-00-00" ? "N/A" : formatDistanceToNowStrict(new Date(mentee.dateOfBirth)) + " old"}
            </Typography>
          </div>
        </Stack>
      </AccordionDetails>
    </Accordion>)}
  </TitledContainer>
};

export default Profile;
