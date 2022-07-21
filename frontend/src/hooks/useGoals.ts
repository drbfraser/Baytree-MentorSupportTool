import { useEffect, useState } from "react";
import { fetchGoals, Goal, GoalQuery } from "../api/goals";

const useGoals = (query: GoalQuery) => {
  const [goals, setGoals] = useState([] as Goal[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [count, setCount] = useState(0);

  const refreshGoals = () => {
    setLoading(true);
    fetchGoals(query)
      .then(({ data, error }) => {
        if (!data || error !== "") {
          setError(error);
        } else {
          setGoals(data.results);
          setCount(data.count);
          setError(undefined);
        }
      }).finally(() => setLoading(false));
  };

  const cleanup = () => {
    setLoading(false);
    setError(undefined);
  };

  // Load goals by params
  useEffect(() => {
    refreshGoals();
    return cleanup;
  }, [query]);

  return {goals, loadingGoals: loading, goalError: error, count, refreshGoals};
};

export default useGoals;

