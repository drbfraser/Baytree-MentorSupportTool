import { Alert, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchGoals, Goal } from "../../api/goals";
import Loading from "../shared/Loading";
import GoalListItem from "./GoalListItem";

const GoalsMiniList = () => {
  const [goals, setGoals] = useState([] as Goal[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchGoals({ limit: 3, offset: 0, status: "IN PROGRESS" })
      .then(({ data, error }) => {
        if (!data || error !== "") {
          setError(error);
        } else setGoals(data);
      }).finally(() => setLoading(false));
    return () => setLoading(false);
  }, []);

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