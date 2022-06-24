import { Box, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { Goal } from "../../api/goals";
import GoalListItem from "./GoalListItem";

type Props = {
  goals: Goal[];
  openDialog: (goal?: Goal) => void;
  handleComplete: (goal: Goal) => Promise<boolean>
}

const GoalsList: FunctionComponent<Props> = ({ goals, openDialog, handleComplete }) => {
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
        handleEdit={() => openDialog(goal)}
        handleComplete={() => handleComplete(goal)} />
    })}
  </Box>
}

export default GoalsList;