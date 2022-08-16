import { useQuery } from "react-query";
import { fetchAllGoalCategories } from "../api/goals";

export const useGoalCategories = () => {
  const { data, isLoading, error } = useQuery("goalCategories", fetchAllGoalCategories, {
    cacheTime: 18000000 // 30 minutes
  });
  return {
    categories: data || [],
    loading: isLoading,
    error: error ? "Cannot fetch goal categories" : ""
  }
};