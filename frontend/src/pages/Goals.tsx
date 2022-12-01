import GoalDialog from "@components/goals/GoalDialog";
import GoalExportButton from "@components/goals/GoalExportButton";
import GoalQuerying from "@components/goals/GoalQuerying";
import GoalsList from "@components/goals/GoalsList";
import GoalsStatistics from "@components/goals/GoalsStatistics";
import { GoalProvider, useGoalContext } from "@context/GoalContext";
import { Box, Button, Icon, Stack, Typography } from "@mui/material";
import { MdAdd } from "react-icons/md";

const Goals = () => {
  const {
    edit: { open },
    openEdit
  } = useGoalContext();

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Goals</Typography>
        {/* Menu buttons */}
        <Stack direction="row" spacing={1}>
          {/*<GoalExportButton />*/}
          <Button
            startIcon={<Icon component={MdAdd} />}
            variant="contained"
            onClick={() => openEdit()}
          >
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
  );
};

const WrappedGoals = () => {
  return (
    <GoalProvider>
      <Goals />
    </GoalProvider>
  );
};

export default WrappedGoals;
