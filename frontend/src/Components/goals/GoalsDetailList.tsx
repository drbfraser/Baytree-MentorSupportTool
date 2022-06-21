import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { Goal } from "../../api/goals";
import GoalListItem from "./GoalListItem";

const GoalsDetailList: FunctionComponent<{ goals: Goal[] }> = ({ goals }) => {
  if (goals.length === 0) {
    return <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>No goals found</Typography>
  }

  return <Box sx={{ mt: 3 }}>
    {goals.map(goal => {
      return <GoalListItem goal={goal} key={goal.id} />
    })}
  </Box>
}

export default GoalsDetailList;