import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { Goal } from "../../api/goals";
import useGoals from "../../hooks/useGoals";
import useMentor from "../../hooks/useMentor";
import exportGoals from "../../Utils/exportGoals";
import Loading from "../shared/Loading";
import GoalDialog from './GoalDialog';
import GoalsDetailList from './GoalsDetailList';
import GoalsStatistics from "./GoalsStatistics";

type Status = Goal["status"];

const GoalsPage = () => {
  // Data state
  const { loading, goals, refreshGoals } = useGoals();
  const { mentor, loadingMentor } = useMentor();
  const [status, setStatus] = useState<Status | undefined>();

  // Dialog state
  const [open, setOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | undefined>();
  const openGoalDialog = (goal?: Goal) => {
    setEditGoal(goal);
    setOpen(true);
  }

  const closeGoalDialog = (refresh?: boolean) => {
    setOpen(false);
    if (refresh) refreshGoals();
  }

  const filter = (goal: Goal) => {
    if (!status) return true;
    return goal.status === status;
  }

  const handleStatus = (status?: Status) => setStatus(status);

  if (loading || loadingMentor) return <Loading />;

  return <>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="h4">Goals</Typography>
      {/* Menu buttons */}
      <Stack direction="row" spacing={1}>
        <CSVLink {...exportGoals(goals, mentor)} style={{ textDecoration: "none" }} filename="goals.csv">
          <Button sx={{height: "100%"}} startIcon={<DownloadIcon />} variant="outlined" color="info">
            Export
          </Button>
        </CSVLink>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => openGoalDialog()}>Add</Button>
      </Stack>
    </Box>
    <GoalsStatistics
      selected={status}
      handleStatus={handleStatus}
      all={goals.length}
      active={goals.filter(g => g.status === "IN PROGRESS").length}
      completed={goals.filter(g => g.status === "ACHIEVED").length} />
      
    <GoalsDetailList 
      goals={goals.filter(filter)} 
      openDialog={openGoalDialog}
      afterComplete={refreshGoals} />
    {open && <GoalDialog open={open} goal={editGoal} handleClose={closeGoalDialog} />}
  </>
}

export default GoalsPage;