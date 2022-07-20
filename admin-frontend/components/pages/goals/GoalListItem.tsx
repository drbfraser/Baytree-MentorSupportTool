import TimelineDot from '@mui/lab/TimelineDot';
import { Accordion, AccordionDetails, AccordionSummary, Alert, CircularProgress, Stack, Typography } from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import { FunctionComponent, useEffect, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { backendGet } from '../../../api/backend/base';
import { Goal, OrderingDate } from "../../../api/backend/goals";

type GoalDetail = Goal & {
  mentee?: {
    firstName: string;
    lastName: string;
  }
}

const GoalItemDetail: FunctionComponent<{ goalId: number }> = ({ goalId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [goal, setGoal] = useState<GoalDetail | null>(null);
  const formatDate = (date: string) => {
    return format(new Date(date), "eeee, MMMM do yyyy");
  }

  useEffect(() => {
    setLoading(true);
    backendGet<GoalDetail>(`goals/${goalId}/`)
      .then(setGoal).catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [goalId]);

  const renderDetails = () => {
    if (loading) return <div style={{display: "flex", width: "100%", justifyContent: "center"}}>
      <CircularProgress sx={{my: 2}} />;
    </div>
    if (error || !goal) return <Alert severity="error">Cannot fetch goal detail</Alert>;
    const menteeName = goal.mentee ? `${goal.mentee.firstName} ${goal.mentee.lastName}` : "N/A";
    return <Stack spacing={1}>
      <div>
        <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Mentor Email</Typography>
        <Typography variant="body2">{goal.mentor?.user.email || "N/A"}</Typography>
      </div>
      <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Mentee Name</Typography>
          <Typography variant="body2">{menteeName}</Typography>
        </div>
      <div>
        <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Creation Date</Typography>
        <Typography variant="body2" gutterBottom>{formatDate(goal.creation_date)}</Typography>
      </div>
      <div>
        <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Review Date</Typography>
        <Typography variant="body2" gutterBottom>{formatDate(goal.goal_review_date)}</Typography>
      </div>
      <div>
        <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Last Update</Typography>
        <Typography variant="body2" gutterBottom>{formatDate(goal.last_update_date)}</Typography>
      </div>
      <div>
        <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Goal Description</Typography>
        <Typography variant="body2">{goal.description}</Typography>
      </div>
    </Stack>
  }

  return <AccordionDetails>
    {renderDetails()}
  </AccordionDetails>
};

type Props = {
  goal: Goal;
  expanded: boolean;
  handleExpansion: () => void;
  orderingDate: OrderingDate;
}

const GoalListItem: FunctionComponent<Props> = ({ goal, expanded, handleExpansion, orderingDate }) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "eeee, MMMM do yyyy");
  }

  const mentorEmail = goal.mentor?.user.email || "N/A";

  return <Accordion
    expanded={expanded}
    onChange={handleExpansion}
    style={{ width: "100%" }}
  >
    <AccordionSummary
      expandIcon={<MdExpandMore />}
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
            {formatDistanceToNow(new Date(goal[orderingDate]), { addSuffix: true })}
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
    {expanded && <GoalItemDetail goalId={goal.id} />}
  </Accordion>
}

export default GoalListItem;