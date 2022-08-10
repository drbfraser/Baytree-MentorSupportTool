import { Box, Button, Icon, Stack, Typography } from "@mui/material";
import { MdAdd } from "react-icons/md";
import { GoalProvider, useGoalContext } from '../../context/GoalContext';
import GoalDialog from './GoalDialog';
import GoalExportButton from './GoalExportButton';
import GoalQuerying from './GoalQuerying';
import GoalsList from './GoalsList';
import GoalsStatistics from "./GoalsStatistics";

const Goals = () => {
  const { edit: { open }, openEdit } = useGoalContext();

  return <>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="h4">Goals</Typography>
      {/* Menu buttons */}
      <Stack direction="row" spacing={1}>
        <GoalExportButton />
        <Button
          startIcon={<Icon component={MdAdd} />}
          variant="contained"
          onClick={() => openEdit()}>
          Add
        </Button>
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