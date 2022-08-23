import { createContext, useContext, useState } from "react";
import type { Goal, GoalDetail, GoalInput, GoalQuery } from "../api/goals";
import { submitCompleteGoal, submitGoal } from "../api/goals";
import useGoals from "../hooks/useGoals";
import useGoalStatistics from "../hooks/useGoalStatistics";

type GoalEdit = {
  goal?: GoalDetail
  open: boolean
}
type GoalContextType = {
  goals: Goal[];
  edit: GoalEdit;
  openEdit: (goal?: GoalDetail) => void;
  closeEdit: () => void;
  error: string;
  query: GoalQuery;
  count: number;
  statistics: { active: number, complete: number };
  loadingGoals: boolean;
  loadingStatistics: boolean;
  handleSubmitGoal: (input: GoalInput, id?: number) => Promise<boolean>;
  handleCompleteGoal: (goal: Goal) => Promise<boolean>;
  handleChangeQuery: (arg: GoalQuery | ((prev: GoalQuery) => GoalQuery)) => void;
}

export const PAGINATION_OPTIONS = [5, 10];
export const DEFAULT_QUERY = {
  limit: PAGINATION_OPTIONS[0],
  offset: 0,
  orderingDate: "creation_date"
} as GoalQuery;

export const GoalContext = createContext<GoalContextType>({
  goals: [],
  edit: { open: false },
  openEdit: (_) => { },
  closeEdit: () => { },
  statistics: { active: 0, complete: 0 },
  loadingGoals: false,
  loadingStatistics: false,
  error: "",
  query: DEFAULT_QUERY,
  count: 0,
  handleSubmitGoal: async (_input, _id) => true,
  handleCompleteGoal: async (_goal) => true,
  handleChangeQuery: (_arg) => { }
});

export const GoalProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const { goals, loadingGoals, goalError, count, refreshGoals } = useGoals(query);
  const { statistics, loadingStatistics, refreshStatistics, statisticsError } = useGoalStatistics();
  const [edit, setEdit] = useState<GoalEdit>({ open: false });

  // Submit a goal
  const handleSubmitGoal = async (input: GoalInput, id?: number) => {
    const submittedGoal = await submitGoal(input, id);
    if (!submittedGoal) return false;
    refreshGoals();
    refreshStatistics();
    return true;
  };

  // Complete a goal
  const handleCompleteGoal = async (goal: Goal) => {
    const success = await submitCompleteGoal(goal.id);
    if (!success) return false;
    refreshGoals();
    refreshStatistics();
    return true;
  }

  return <GoalContext.Provider
    value={{
      loadingGoals,
      loadingStatistics,
      statistics,
      goals,
      edit,
      openEdit: (goal) => setEdit({ goal, open: true }),
      closeEdit: () => setEdit({ open: false }),
      count,
      error: statisticsError || goalError || "",
      query,
      handleSubmitGoal,
      handleCompleteGoal,
      handleChangeQuery: (fn) => {
        setQuery(fn);
      }
    }} {...props} />
};

export const useGoalContext = () => {
  return useContext(GoalContext);
}