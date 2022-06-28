import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GoalsMiniList from "../goals/GoalsMiniList";

const ActiveGoalsSummary = () => {
  const navigate = useNavigate();
  return <>
    <Box sx={{ my: 2, display: "flex", justifyContent: "space-between", alignContent: "center" }}>
      <Typography
        component="h2"
        sx={{fontSize: 16}}
        variant="button"
        color="text.secondary"
      >
        Active Goals
      </Typography>
      <Button variant="outlined" color="secondary" onClick={() => navigate('/dashboard/goals')}>See more</Button>
    </Box>
    <GoalsMiniList />
  </>
};

export default ActiveGoalsSummary;