import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TimelineDot from "@mui/lab/TimelineDot";
import { Accordion, AccordionSummary, Typography, AccordionDetails, Stack } from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import { FunctionComponent } from "react";
import { Goal } from "../../../api/backend/goals";

const GoalListItem: FunctionComponent<{ goal: Goal, expanded: boolean, handleExpansion: () => void }> = ({ goal, expanded, handleExpansion }) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "eeee, MMMM do yyyy");
  }

  const mentorEmail = goal.mentor?.user.email || "N/A";
  const menteeName = goal.mentee ? `${goal.mentee.firstName} ${goal.mentee.lastName}` : "N/A";

  return <Accordion
    expanded={expanded}
    onChange={handleExpansion}
    style={{ width: "100%" }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {goal.title}
        </Typography>
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '8px' }}>
          <Typography
            sx={{
              color: "text.secondary",
              margin: "8px",
              paddingRight: '8px'
            }}
          >
            {formatDistanceToNow(new Date(goal.creation_date), { addSuffix: true })}
          </Typography>
          <Typography sx={{ color: "text.secondary", margin: "6px" }}>
            {goal.status}
          </Typography>
          {goal.status === "IN PROGRESS" ? (
            <TimelineDot color="error" sx={{ backgroundColor: "red", alignSelf: 'center' }} />
          ) : goal.status === "ACHIEVED" ? (
            <TimelineDot color="success" sx={{ backgroundColor: "green", alignSelf: 'center' }} />
          ) : (
            <TimelineDot color="success" sx={{ backgroundColor: "blue", alignSelf: 'center' }} />
          )}
        </div>
      </div>
    </AccordionSummary>
    <AccordionDetails>
      <Stack spacing={1}>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Mentor Email</Typography>
          <Typography variant="body2">{mentorEmail}</Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Created Date</Typography>
          <Typography variant="body2" gutterBottom>{formatDate(goal.creation_date)}</Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Goal Review Date</Typography>
          <Typography variant="body2" gutterBottom>{formatDate(goal.goal_review_date)}</Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Last Update Date</Typography>
          <Typography variant="body2" gutterBottom>{formatDate(goal.last_update_date)}</Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Mentee Name</Typography>
          <Typography variant="body2">{menteeName}</Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Goal Description</Typography>
          <Typography variant="body2">{goal.description}</Typography>
        </div>
      </Stack>
    </AccordionDetails>
  </Accordion>
}

export default GoalListItem;