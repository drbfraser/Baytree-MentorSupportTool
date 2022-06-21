import { Box, Button, Stack, Typography } from "@mui/material";
import useGoals from "../../hooks/useGoals";
import Loading from "../shared/Loading";
import GoalsStatistics from "./GoalsStatistics";
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import GoalListItem from "./GoalListItem";
import { useState } from "react";
import { Goal } from "../../api/goals";

type Status = Goal["status"];

const GoalsPage = () => {
  const { loading, goals } = useGoals();
  const [status, setStatus] = useState<Status | undefined>(undefined);

  const filter = (goal: Goal) => {
    if (!status) return true;
    return goal.status === status;
  }

  const handleStatus = (status?: Status) => setStatus(status);

  if (loading) return <Loading />;

  return <>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2}}>
      <Typography variant="h4">Goals</Typography>
      {/* Menu buttons */}
      <Stack direction="row" spacing={1}>
        <Button startIcon={<DownloadIcon />} variant="outlined">Export</Button>
        <Button startIcon={<AddIcon />} variant="contained">Add</Button>
      </Stack>
    </Box>
    <GoalsStatistics
      selected={status}
      handleStatus={handleStatus}
      all={goals.length}
      active={goals.filter(g => g.status === "IN PROGRESS").length}
      completed={goals.filter(g => g.status === "ACHIEVED").length} />
    <Box sx={{mt: 3}}>
      {goals.filter(filter).map(goal => {
        return <GoalListItem goal={goal} key={goal.id} />
      })}
    </Box>
  </>
}

export default GoalsPage;