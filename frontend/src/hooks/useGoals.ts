import { useEffect, useState } from "react";
import { fetchAllGoals, Goal, GoalParams } from "../api/goals";

const useGoals = (params?: GoalParams) => {
  const [goals, setGoals] = useState([] as Goal[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshGoals = () => {
    console.log("Refreshing...")
    setLoading(true);
    fetchAllGoals(params)
    .then(({data, error}) => {
      if (!data || error !== "") {
        setError(error);
      } else setGoals(data);
    }).finally(() => setLoading(false));
  }

  useEffect(() => {
    refreshGoals();
    return () => setLoading(false);
  }, []);

  return {
    goals,
    loading,
    error,
    refreshGoals,
  }
}

export default useGoals;