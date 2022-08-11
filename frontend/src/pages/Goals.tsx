import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Stack, Typography } from "@mui/material";
import { GoalProvider, useGoalContext } from '../context/GoalContext';
import GoalDialog from '../Components/goals/GoalDialog';
import GoalExportButton from '../Components/goals/GoalExportButton';
import GoalQuerying from '../Components/goals/GoalQuerying';
import GoalsList from '../Components/goals/GoalsList';
import GoalsStatistics from "../Components/goals/GoalsStatistics";

const Goals = () => {
  const {edit: {open}, openEdit} = useGoalContext();

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