import { Alert, AlertTitle, Box, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { Goal } from "../../api/goals";
import { useGoals } from "../../context/GoalContext";
import Loading from "../shared/Loading";
import GoalListItem from "./GoalListItem";

type Props = {
  openDialog: (goal?: Goal) => void;
}

const GoalsList: FunctionComponent<Props> = ({ openDialog }) => {
  const {loadingGoals, error, goals} = useGoals();

  if (loadingGoals) return <Loading />;
  if (error) return <Alert>
    <AlertTitle>{error}</AlertTitle>
    Please refresh the page or contact the adminstrators.
  </Alert>
  
  if (goals.length === 0)
    return <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>No goals found</Typography>

  const [selected, setSelected] = useState<number | undefined>(undefined);

  return <Box sx={{ mt: 3 }}>
    {goals.map(goal => {
      return <GoalListItem
        goal={goal}
        key={goal.id}
        expanded={selected === goal.id}
        handleClick={() => setSelected(selected === goal.id ? undefined : goal.id)}
        handleEdit={() => openDialog(goal)} />
    })}
  </Box>
}

export default GoalsList;