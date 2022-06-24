import { useEffect, useState } from "react";
import { fetchAllGoals, Goal, GoalInput, GoalParams, submitCompleteGoal, submitGoal } from "../api/goals";

const useGoals = (params?: GoalParams) => {
  const [goals, setGoals] = useState([] as Goal[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAllGoals(params)
      .then(({ data, error }) => {
        if (!data || error !== "") {
          setError(error);
        } else setGoals(data);
      }).finally(() => setLoading(false));
    return () => setLoading(false);
  }, []);

  // Returns true if the goals is successfully submitted
  const handleSubmitGoal = async (input: GoalInput, id?: number) => {
    const submittedGoal = await submitGoal(input, id);
    if (!submittedGoal) return false;

    // If not found, add it
    if (!id) setGoals((goals) => [...goals, submittedGoal]);

    // Otherwise, update it
    const newGoals = goals.map(goal => goal.id === id ? submittedGoal : goal);
    setGoals(newGoals);
    return true;
  }

  const handleCompleteGoal = async (goal: Goal) => {
    const success = await submitCompleteGoal(goal.id);
    if (!success) return false;
    goal.status = "ACHIEVED";
    const newGoals = goals.map(item => item.id === goal.id ? goal : item);
    setGoals(newGoals);
    return true;
  }

  return {
    goals,
    loading,
    error,
    handleSubmitGoal,
    handleCompleteGoal
  }
}

export default useGoals;