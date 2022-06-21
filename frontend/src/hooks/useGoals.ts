import { useEffect, useState } from "react";
import { fetchAllGoals, Goal } from "../api/goals";

const useGoals = () => {
  const [goals, setGoals] = useState([] as Goal[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAllGoals()
    .then(({data, error}) => {
      if (!data || error !== "") {
        setError(error);
      } else setGoals(data);
    }).finally(() => setLoading(false));
    return () => setLoading(false);
  }, []);

  return {
    goals,
    loading,
    error
  }
}

export default useGoals;