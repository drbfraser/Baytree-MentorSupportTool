import axios from "axios";
import { format } from "date-fns";
import { API_BASE_URL } from "./url";
import { Participant } from "./views";

export const goalsApi = axios.create({
  baseURL: `${API_BASE_URL}/goals`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

export interface Goal {
  id: number;
  title: string;
  creation_date: string;
  goal_review_date: string;
  last_update_date: string;
  status: "IN PROGRESS" | "RECALIBRATED" | "ACHIEVED";
  description: string;
}

export interface GoalInput {
  title: string;
  goal_review_date: Date;
  description: string;
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

export const fetchGoals = async (limit?: number, offset?: number) => {
  let params = {} as any;
  if (limit) params.limit = limit;
  if (offset) params.offset = offset;
}

export const submitGoal = async (input: GoalInput, id?: number) => {
  let data: any = {
    title: input.title,
    goal_review_date: format(input.goal_review_date, "yyyy-MM-dd"),
    description: input.description
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