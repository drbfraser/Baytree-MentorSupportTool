import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Stack, TablePagination, Typography } from "@mui/material";
import { useState } from "react";
import { Goal } from "../../api/goals";
import { GoalProvider } from '../../context/GoalContext';
import GoalDialog from './GoalDialog';
import GoalExportButton from './GoalExportButton';
import GoalsList from './GoalsList';
import GoalsStatistics from "./GoalsStatistics";

const Goals = () => {
  // Dialog states
  const [open, setOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | undefined>();
  const openGoalDialog = (goal?: Goal) => {
    setEditGoal(goal);
    setOpen(true);
  }
  const closeGoalDialog = () => setOpen(false);

  return <GoalProvider>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="h4">Goals</Typography>
      {/* Menu buttons */}
      <Stack direction="row" spacing={1}>
        <GoalExportButton />
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => openGoalDialog()}>Add</Button>
      </Stack>
    </Box>

    <GoalsStatistics />

    {/* Goal list */}
    <GoalsList openDialog={openGoalDialog} />
    {open && <GoalDialog open={open} goal={editGoal} handleClose={closeGoalDialog} />}
  </GoalProvider>
}

export default Goals;