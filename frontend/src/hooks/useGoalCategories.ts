import { useEffect, useState } from "react";
import { fetchAllGoalCategories, GoalCategory } from "../api/goals";

export const useGoalCategories = () => {
  const [categories, setCategories] = useState([] as GoalCategory[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAllGoalCategories()
      .then(({ data, error }) => {
        if (data && !error) setCategories(data);
        else setError(error);
      }).finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
};