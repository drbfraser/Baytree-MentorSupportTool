import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import { FunctionComponent } from "react";
import { toast } from 'react-toastify';
import { Goal } from "../../api/goals";
import GoalStatus from "./GoalStatus";

type Props = {
  goal: Goal;
  expanded?: boolean;
  handleClick?: () => void;
  handleEdit?: () => void;
  handleComplete?: () => Promise<boolean>;
  minified?: boolean;
};

const GoalListItem: FunctionComponent<Props> = ({ goal, handleEdit, expanded, handleClick, handleComplete, minified }) => {
  const formatDate = (date: Date) => format(date, "eeee, MMMM do yyyy");
  const menteeName = goal.mentee ? `${goal.mentee.firstName} ${goal.mentee.lastName}` : "N/A";

  const handleCompleteButton = async () => {
    if (!handleComplete) return;
    const success = await handleComplete();
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
          }}>{formatDistanceToNow(new Date(goal.creation_date), { addSuffix: true })}</Typography>}
          <GoalStatus status={goal.status} />
        </Stack>
      </Box>
    </AccordionSummary>
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
      <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
      <Button variant="contained" startIcon={<CheckIcon />} onClick={handleCompleteButton}>Complete</Button>
    </AccordionActions>}
  </Accordion>
};

export default GoalListItem;