import axios from "axios";
import { format } from "date-fns";
import { API_BASE_URL } from "./url";
import { Participant } from "./views";

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

export interface GoalDetail extends Goal {
  mentee?: Participant;
}

export interface GoalInput {
  title: string;
  goal_review_date: Date;
  mentee_id?: number | string;
  description: string;
  categories: GoalCategory[];
}

export type OrderBy = "creation_date" | "goal_review_date" | "last_update_date";

export type GoalQuery = {
  limit: number;
  offset: number;
  status?: Goal["status"];
  categories?: GoalCategory[];
  orderBy: OrderBy;
  ascending?: boolean
}

export const fetchAllGoals = async (query: GoalQuery = { limit: 5, offset: 0, orderBy: "creation_date" }) => {
  let params: any = {
    limit: query.limit,
    offset: query.offset,
  }

  if (query.status) params.status = query.status;
  if (query.categories && query.categories.length > 0) params.categories = query.categories.map(c => c.id).join(',')
  if (query.orderBy) params.ordering = (!query.ascending ? '-' : '') + query.orderBy

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
    else throw Error;
  } catch (err) {
    return { data: undefined, error: "Cannot fetch goals" }
  }
};

export const fetchGoalStatistics = async () => {
  try {
    const apiRes = await goalsApi.get<{ active: number, complete: number }>("statistics/")
    if (apiRes.status === 200) {
      return { data: apiRes.data, error: "" }
    } else throw Error;
  } catch (error) {
    return { data: undefined, error: "Cannot fetch goal satistics" };
  }
}

export const fetchAllGoalCategories = async () => {
  const apiRes = await goalsApi.get<GoalCategory[]>("categories/");
  return apiRes.data;
}

export const fetchGoalById = async (id: number) => {
  const apiRes = await goalsApi.get<GoalDetail>(`${id}/`);
  return apiRes.data;
} 

export const submitGoal = async (input: GoalInput, id?: number) => {
  let data: any = {
    title: input.title,
    goal_review_date: format(input.goal_review_date, "yyyy-MM-dd"),
    description: input.description,
    categories: input.categories.map(item => item.id)
  }
  if (input.mentee_id) data.mentee_id = +input.mentee_id;
  console.log(data);
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