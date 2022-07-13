import axios from "axios";
import { format } from "date-fns";
import { API_BASE_URL } from "./url";

export const goalsApi = axios.create({
  baseURL: `${API_BASE_URL}/goals`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

export interface GoalCategory {
  id: number;
  name: string;
}

export interface Goal {
  id: number;
  title: string;
  creation_date: string;
  goal_review_date: string;
  last_update_date: string;
  status: "IN PROGRESS" | "RECALIBRATED" | "ACHIEVED";
  description: string;
  categories: GoalCategory[];
}

export interface GoalInput {
  title: string;
  goal_review_date: Date;
  description: string;
  categories: GoalCategory[];
}

export type GoalParams = {
  limit?: number;
  offset?: number;
  active?: boolean;
  completed?: boolean;
}

export const fetchAllGoals = async (params: GoalParams = {}) => {
  try {
    const apiRes = await goalsApi.get("", {
      params
    });
    if (apiRes.status === 200) {
      // Not nice implementation because of Django REST Framework
      // with built-in pagination
      const data = apiRes.data;
      if (data.results) {
        return { data: data.results as Goal[], error: "" };
      } else {
        return { data: data as Goal[], error: "" }
      }
    }
    if (apiRes.status === 404)
      return { data: undefined, error: "Cannot find users or goals" }
    else throw Error
  } catch (err) {
    return { data: undefined, error: "Cannot fetch goals" }
  }
};

export const fetchAllGoalCategories = async () => {
  try {
    const apiRes = await goalsApi.get<GoalCategory[]>("categories/");
    if (apiRes.status === 200) {
      return { data: apiRes.data, error: "" };
    } else throw Error;
  } catch (_err) {
    return { data: undefined, error: "Cannot fetch goal categories" };
  }
}

export const submitGoal = async (input: GoalInput, id?: number) => {
  let data: any = {
    title: input.title,
    goal_review_date: format(input.goal_review_date, "yyyy-MM-dd"),
    description: input.description,
    categories: input.categories.map(item => item.id)
  }
  try {
    const promise = id ? goalsApi.put<Goal>(`${id}/`, data) : goalsApi.post<Goal>("", data);
    const response = await promise;
    return response.data;
  } catch (err) {
    // Anything other than 2xx code
    return undefined;
  }
}

export const submitCompleteGoal = async (goalId: number) => {
  try {
    await goalsApi.patch(`${goalId}/`, { status: "ACHIEVED" });
    return true;
  } catch (err) {
    return false;
  }
};