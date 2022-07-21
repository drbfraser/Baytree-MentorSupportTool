import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Goal, GoalDetail } from "../../api/goals";
import { GoalProvider, useGoals } from '../../context/GoalContext';
import GoalDialog from './GoalDialog';
import GoalExportButton from './GoalExportButton';
import GoalQuerying from './GoalQuerying';
import GoalsList from './GoalsList';
import GoalsStatistics from "./GoalsStatistics";

const Goals = () => {
  const {edit: {open}, openEdit} = useGoals();

  return <>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="h4">Goals</Typography>
      {/* Menu buttons */}
      <Stack direction="row" spacing={1}>
        <GoalExportButton />
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => openEdit()}>Add</Button>
      </Stack>
    </Box>

    <GoalsStatistics />

    {/* Goal list */}
    <GoalQuerying />
    <GoalsList />
    {open && <GoalDialog />}
  </>
}

const WrappedGoals = () => {
  return <GoalProvider>
    <Goals />
  </GoalProvider>
}

export default WrappedGoals;