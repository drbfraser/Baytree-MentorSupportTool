import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { Goal } from "../../api/goals";
import GoalListItem from "./GoalListItem";
import {useState} from "react";

const GoalsDetailList: FunctionComponent<{ goals: Goal[], openDialog: (goal?: Goal) => void }> = ({ goals, openDialog }) => {
  if (goals.length === 0) {
    return <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>No goals found</Typography>
  }

  const [selected, setSelected] = useState<number | undefined>(undefined);

  return <Box sx={{ mt: 3 }}>
    {goals.map(goal => {
      return <GoalListItem 
        goal={goal} 
        key={goal.id} 
        expanded={selected === goal.id} 
        handleClick={() => selected === goal.id ? setSelected(undefined) : setSelected(goal.id)}
        handleEdit={() => openDialog(goal)} />
    })}
  </Box>
}

export default GoalsDetailList;