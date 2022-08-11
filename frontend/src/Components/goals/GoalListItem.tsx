import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, AlertTitle, Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import { FunctionComponent, useEffect } from "react";
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { fetchGoalById, Goal } from "../../api/goals";
import { useGoalContext } from '../../context/GoalContext';
import Loading from '../shared/Loading';
import GoalStatus from "./GoalStatus";

type Props = {
  goal: Goal;
  expanded?: boolean;
  handleClick?: () => void;
  minified?: boolean;
};

type DetailProps = {
  goalId: number;
  minified?: boolean;
}

const GoalItemDetail: FunctionComponent<DetailProps> = ({ goalId, minified }) => {
  const { handleCompleteGoal, openEdit } = useGoalContext();
  const { data: goal, isLoading, error } = useQuery(`goal-${goalId}`, async () => fetchGoalById(goalId));
  const formatDate = (date: Date) => format(date, "eeee, MMMM do yyyy");

  useEffect(() => () => toast.dismiss(), []);

  if (isLoading) return <Loading />;
  if (error || !goal) return <Alert severity="error">
    <AlertTitle>Cannot fetch the goal detail</AlertTitle>
    Please try again later
  </Alert>

  const menteeName = goal.mentee ? `${goal.mentee.firstName} ${goal.mentee.lastName}` : "N/A";

  const handleCompleteButton = async () => {
    const success = await handleCompleteGoal(goal);
    if (!success) toast.error("Cannot update the goal");
    else toast.success("Goal marked as completed");
  }


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

  return <>
    <AccordionDetails>
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
    <Divider />
    {!minified && goal.status === "IN PROGRESS" && <AccordionActions>
      <Button
        className="edit-button"
        variant="outlined"
        disabled={isLoading}
        startIcon={<EditIcon />}
        onClick={() => openEdit(goal)}>
        Edit
      </Button>
      <Button
        className="complete-button"
        variant="contained"
        disabled={isLoading}
        startIcon={<CheckIcon />}
        onClick={handleCompleteButton}>
        Complete
      </Button>
    </AccordionActions>}
  </>
};

const GoalListItem: FunctionComponent<Props> = ({ goal, expanded, handleClick, minified }) => {
  const { query: { orderingDate } } = useGoalContext();

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
          }}>{formatDistanceToNow(new Date(goal[orderingDate]), { addSuffix: true })}</Typography>}
          {!minified && <GoalStatus status={goal.status} />}
        </Stack>
      </Box>
    </AccordionSummary>
    {expanded && <GoalItemDetail goalId={goal.id} minified={minified} />}
  </Accordion>
};

export default GoalListItem;