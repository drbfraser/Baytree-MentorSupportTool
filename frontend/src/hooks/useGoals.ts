import { useQuery } from "react-query";
import { fetchGoals, GoalQuery } from "../api/goals";

const useGoals = (query: GoalQuery) => {
  const {data, isLoading, error, refetch} = useQuery(["goal", query], () => fetchGoals(query));

  return {
    goals: data?.results || [], 
    loadingGoals: isLoading, 
    goalError: ((error || !data) && !isLoading) ? "Cannot retrieve goals" : undefined, 
    count: data?.count || 0, 
    refreshGoals: refetch};
};

export default useGoals;

