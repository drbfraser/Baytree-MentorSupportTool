import AddIcon from '@mui/icons-material/Add';
import { Alert, AlertTitle, Box, Button, Stack, Typography } from "@mui/material";
import { ReactText, useEffect, useState } from "react";
import { Goal } from "../../api/goals";
import useGoals from "../../hooks/useGoals";
import useMentor from "../../hooks/useMentor";
import Loading from "../shared/Loading";
import GoalDialog from './GoalDialog';
import GoalExportButton from './GoalExportButton';
import GoalsList from './GoalsList';
import GoalsStatistics from "./GoalsStatistics";

const Goals = () => {
  // Data state
  const { loading, goals, handleSubmitGoal, handleCompleteGoal, error } = useGoals();
  const [status, setStatus] = useState<Goal["status"] | undefined>();

  // Dialog state
  const [open, setOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | undefined>();
  const openGoalDialog = (goal?: Goal) => {
    setEditGoal(goal);
    setOpen(true);
  }

  const closeGoalDialog = () => setOpen(false);

  const filter = (goal: Goal) => {
    if (!status) return true;
    return goal.status === status;
  }

  const handleStatus = (status?: Goal["status"]) => setStatus(status);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">
    <AlertTitle>{error}</AlertTitle>
    Please refresh the page or contact adminstrator for assitance
  </Alert>

  return <>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="h4">Goals</Typography>
      {/* Menu buttons */}
      <Stack direction="row" spacing={1}>
        <GoalExportButton />
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => openGoalDialog()}>Add</Button>
      </Stack>
    </Box>

    {/* Clickable statistics */}
    <GoalsStatistics
      selected={status}
      handleStatus={handleStatus}
      all={goals.length}
      active={goals.filter(g => g.status === "IN PROGRESS").length}
      completed={goals.filter(g => g.status === "ACHIEVED").length} />

    <GoalsList
      goals={goals.filter(filter)}
      openDialog={openGoalDialog}
      handleComplete={handleCompleteGoal} />
    {open && <GoalDialog open={open} goal={editGoal} handleClose={closeGoalDialog} handleSubmitGoal={handleSubmitGoal} />}
  </>
}

export default Goals;