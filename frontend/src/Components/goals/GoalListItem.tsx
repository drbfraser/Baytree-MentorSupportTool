import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import { FunctionComponent } from "react";
import { Goal } from "../../api/goals";
import GoalStatus from "./GoalStatus";

const GoalListItem: FunctionComponent<{ goal: Goal }> = ({ goal }) => {
  const creationTime = formatDistanceToNow(new Date(goal.creation_date), { addSuffix: true });
  const formatDate = (date: Date) => format(date, "eeee, MMMM do yyyy");
  const menteeName = `${goal.mentee.firstName} ${goal.mentee.lastName}`

  return <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        paddingRight: "8px"
      }}>
        <Typography variant="h6">{goal.title}</Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="subtitle2">{creationTime}</Typography>
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
  </Accordion>
};

export default GoalListItem;