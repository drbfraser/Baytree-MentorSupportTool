import { Alert, Box } from "@mui/material";
import { useState } from "react";
import useGoals from "../../hooks/useGoals";
import Loading from "../shared/Loading";
import GoalListItem from "./GoalListItem";

const GoalsMiniList = () => {
  const { goals, loading, error } = useGoals({ limit: 3, active: true });
  const [id, setId] = useState<number | undefined>();

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (goals.length === 0) return <Alert severity="info">All goals achieved!</Alert>;

  return <Box>
    {goals.map((goal) => {
      const expanded = id === goal.id;
      const handleClick = () => expanded ? setId(undefined) : setId(goal.id)
      return <GoalListItem 
        key={goal.id} 
        expanded={expanded}
        handleClick={handleClick}
        goal={goal} 
        minified />
    })}
  </Box>
}

export default GoalsMiniList;