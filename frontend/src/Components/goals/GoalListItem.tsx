import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, AlertTitle, Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import { FunctionComponent, useEffect, useState } from "react";
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { fetchGoalById, Goal } from "../../api/goals";
import { useGoals } from '../../context/GoalContext';
import Loading from '../shared/Loading';
import GoalStatus from "./GoalStatus";

type Props = {
  goal: Goal;
  expanded?: boolean;
  handleClick?: () => void;
  handleEdit?: () => void;
  handleComplete?: () => Promise<boolean>;
  minified?: boolean;
};

type DetailProps = {
  goalId: number;
  minified?: boolean;
  setLoading: (loading: boolean) => void;
}

const GoalItemDetail: FunctionComponent<DetailProps> = ({ goalId, minified, setLoading }) => {
  const { data: goal, isLoading, error } = useQuery(`goal-${goalId}`, async () => fetchGoalById(goalId));
  const formatDate = (date: Date) => format(date, "eeee, MMMM do yyyy");

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading]);

  if (isLoading) return <Loading />;
  if (error || !goal) return <Alert severity="error">
    <AlertTitle>Cannot fetch the goal detail</AlertTitle>
    Please try again later
  </Alert>

  const menteeName = goal.mentee ? `${goal.mentee.firstName} ${goal.mentee.lastName}` : "N/A";


  const renderCategories = () => {
    let categories = goal.categories;
    const length = categories.length;
    if (length === 0)
      return <Typography variant="subtitle1">No categories assigned</Typography>
    if (length > 2 && minified)
      categories = categories.slice(0, 2);
    return <Box>
      {categories.map(category => (
        <Chip key={category.id} label={category.name} sx={{ mt: 1, mr: 1 }} />
      ))}
      {minified && length > 2 && <Chip variant="outlined" label={`+${length - 2} more`} sx={{ mt: 1, mr: 1 }} />}
    </Box>
  }

  return <AccordionDetails>
    <Stack spacing={1}>
      {!minified && <div>
        <Typography variant="body1"><strong>Creation Date</strong></Typography>
        <Typography variant="subtitle1">{formatDate(new Date(goal.creation_date))}</Typography>
      </div>}
      <div>
        <Typography variant="body1"><strong>Review Date</strong></Typography>
        <Typography variant="subtitle1">{formatDate(new Date(goal.goal_review_date))}</Typography>
      </div>
      {!minified && <div>
        <Typography variant="body1"><strong>Last Update</strong></Typography>
        <Typography variant="subtitle1">{formatDate(new Date(goal.last_update_date))}</Typography>
      </div>}
      {!minified && <div>
        <Typography variant="body1"><strong>Mentee</strong></Typography>
        <Typography variant="subtitle1">{menteeName}</Typography>
      </div>}
      <div>
        <Typography variant="body1"><strong>Description</strong></Typography>
        <Typography variant="subtitle1">{goal.description}</Typography>
      </div>
      <div>
        <Typography variant="body1"><strong>Categories</strong></Typography>
        {renderCategories()}
      </div>
    </Stack>
  </AccordionDetails>
};

const GoalListItem: FunctionComponent<Props> = ({ goal, handleEdit, expanded, handleClick, handleComplete, minified }) => {
  const { query: { orderBy } } = useGoals();
  const [loading, setLoading] = useState(false);

  const handleCompleteButton = async () => {
    if (!handleComplete) return;
    const success = await handleComplete();
    if (!success) toast.error("Cannot update the goal");
    else toast.success("Goal marked as completed");
  }

  return <Accordion expanded={expanded} onClick={handleClick}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        paddingRight: "8px"
      }}>
        <Typography variant={minified ? "subtitle2" : "h6"}>{goal.title}</Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {!minified && <Typography variant="subtitle2" sx={{
            display: {
              xs: "none",
              sm: "block"
            }
          }}>{formatDistanceToNow(new Date(goal[orderBy]), { addSuffix: true })}</Typography>}
          {!minified && <GoalStatus status={goal.status} />}
        </Stack>
      </Box>
    </AccordionSummary>
    {expanded && <GoalItemDetail goalId={goal.id} minified={minified} setLoading={setLoading} />}
    <Divider />
    {!minified && goal.status === "IN PROGRESS" && <AccordionActions>
      <Button variant="outlined" disabled={loading} startIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
      <Button variant="contained" disabled={loading} startIcon={<CheckIcon />} onClick={handleCompleteButton}>Complete</Button>
    </AccordionActions>}
  </Accordion>
};

export default GoalListItem;