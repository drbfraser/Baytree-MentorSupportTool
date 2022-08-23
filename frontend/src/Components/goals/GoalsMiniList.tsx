import { Alert, Box } from "@mui/material";
import { useState } from "react";
import useGoals from "../../hooks/useGoals";
import Loading from "../shared/Loading";
import GoalListItem from "./GoalListItem";

const GoalsMiniList = () => {
  const { goals, loadingGoals, goalError } = useGoals({
    limit: 3,
    offset: 0,
    orderingDate: "goal_review_date"
  });

  const [id, setId] = useState<number | undefined>();

  if (loadingGoals) return <Loading />;
  if (goalError) return <Alert severity="error">{goalError}</Alert>;
  if (goals.length === 0) return <Alert severity="success">All goals achieved!</Alert>;

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