import { Alert, Box } from "@mui/material";
import useGoals from "../../hooks/useGoals";
import Loading from "../shared/Loading";
import GoalListItem from "./GoalListItem";

const GoalsMiniList = () => {
  const { goals, loading, error } = useGoals({ limit: 3, active: true });

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (goals.length === 0) return <Alert severity="info">All goals achieved!</Alert>;

  return <Box>
    {goals.map((goal) => <GoalListItem key={goal.id} goal={goal} minified />)}
  </Box>
}

export default GoalsMiniList;