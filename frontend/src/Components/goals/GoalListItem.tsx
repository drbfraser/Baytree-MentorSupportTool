import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import { FunctionComponent } from "react";
import { Goal } from "../../api/goals";
import GoalStatus from "./GoalStatus";

type Props = {
  goal: Goal;
  expanded?: boolean;
  handleClick?: () => void;
  handleEdit?: () => void;
};

const GoalListItem: FunctionComponent<Props> = ({ goal, handleEdit, expanded, handleClick }) => {
  const creationTime = formatDistanceToNow(new Date(goal.creation_date), { addSuffix: true });
  const formatDate = (date: Date) => format(date, "eeee, MMMM do yyyy");
  const menteeName = goal.mentee ? `${goal.mentee.firstName} ${goal.mentee.lastName}` : "N/A";

  return <Accordion expanded={expanded} onClick={handleClick}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        paddingRight: "8px"
      }}>
        <Typography variant="h6">{goal.title}</Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{display: {
            xs: "none",
            sm: "block"
          }}}>{creationTime}</Typography>
          <GoalStatus status={goal.status} />
        </Stack>
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      <Stack spacing={1}>
        <div>
          <Typography variant="body1"><strong>Creation Date</strong></Typography>
          <Typography variant="subtitle1">{formatDate(new Date(goal.creation_date))}</Typography>
        </div>
        <div>
          <Typography variant="body1"><strong>Review Date</strong></Typography>
          <Typography variant="subtitle1">{formatDate(new Date(goal.goal_review_date))}</Typography>
        </div>
        <div>
          <Typography variant="body1"><strong>Last Update</strong></Typography>
          <Typography variant="subtitle1">{formatDate(new Date(goal.last_update_date))}</Typography>
        </div>
        <div>
          <Typography variant="body1"><strong>Mentee</strong></Typography>
          <Typography variant="subtitle1">{menteeName}</Typography>
        </div>
        <div>
          <Typography variant="body1"><strong>Description</strong></Typography>
          <Typography variant="subtitle1">{goal.description}</Typography>
        </div>
      </Stack>
    </AccordionDetails>
    <Divider />
    {goal.status === "IN PROGRESS" && <AccordionActions>
      <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
      <Button variant="contained" startIcon={<CheckIcon />}>Complete</Button>
    </AccordionActions>}
  </Accordion>
};

export default GoalListItem;