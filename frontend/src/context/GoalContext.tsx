import { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import { fetchAllGoals, fetchGoalStatistics, Goal, GoalInput, GoalParams, submitCompleteGoal, submitGoal } from "../api/goals";

interface GoalContextType {
  goals: Goal[];
  error: string;
  params: GoalParams;
  statistics: { active: number, complete: number };
  loadingGoals: boolean;
  loadingStatistics: boolean;
  handleSubmitGoal: (input: GoalInput, id?: number) => Promise<boolean>;
  handleCompleteGoal: (goal: Goal) => Promise<boolean>;
  handleChangeParams: (arg: GoalParams | ((params: GoalParams) => GoalParams)) => void;
}

export const PAGINATION_OPTIONS = [5, 10];
export const DEFAULT_PAGINATION = {
  limit: PAGINATION_OPTIONS[0],
  offset: 0
} as GoalParams;

export const GoalContext = createContext<GoalContextType>({
  goals: [],
  statistics: { active: 0, complete: 0 },
  loadingGoals: false,
  loadingStatistics: false,
  error: "",
  params: DEFAULT_PAGINATION,
  handleSubmitGoal: async (_input, _id) => true,
  handleCompleteGoal: async (_goal) => true,
  handleChangeParams: (_arg) => {}
});

export const GoalProvider: FunctionComponent<{}> = (props) => {
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [params, setParams] = useState(DEFAULT_PAGINATION);
  const [statistics, setStatistics] = useState({ active: 0, complete: 0 });
  const [goals, setGoals] = useState([] as Goal[]);
  const [error, setError] = useState("");

  const loadGoals = () => {
    setLoadingGoals(true);
    fetchAllGoals(params)
      .then(({ data, error }) => {
        if (!data || error !== "") {
          setError(error);
        } else setGoals(data);
      }).finally(() => setLoadingGoals(false));
  };

  const cleanup = () => {
    setLoadingGoals(false);
    setError("");
  };

  // Load goals by params
  useEffect(() => {
    loadGoals();
    return cleanup;
  }, [params]);

  // Loading statistics
  useEffect(() => {
    setLoadingStatistics(true);
    fetchGoalStatistics().then(({ data, error }) => {
      if (!data || error !== "") {
        setError(error);
      } else setStatistics(data);
    }).finally(() => setLoadingStatistics(false));
  }, []);

  // Submit a goal
  const handleSubmitGoal = async (input: GoalInput, id?: number) => {
    const submittedGoal = await submitGoal(input, id);
    if (!submittedGoal) return false;
    if (!id)
      setStatistics(prev => ({
        ...prev,
        active: prev.active + 1,
      }));
    loadGoals();
    return true;
  };

  // Complete a goal
  const handleCompleteGoal = async (goal: Goal) => {
    const success = await submitCompleteGoal(goal.id);
    if (!success) return false;
    setStatistics(prev => ({
      active: prev.active - 1,
      complete: prev.complete + 1
    }));
    loadGoals();
    return true;
  }

  const handleChangeParams = (arg: GoalParams | ((params: GoalParams) => GoalParams)) => {
    setParams(arg);
  }

  return <GoalContext.Provider
    value={{
      loadingGoals, 
      loadingStatistics,
      statistics,
      goals,
      error,
      params,
      handleSubmitGoal,
      handleCompleteGoal,
      handleChangeParams
    }} {...props} />
};

export const useGoals = () => {
  return useContext(GoalContext);
}