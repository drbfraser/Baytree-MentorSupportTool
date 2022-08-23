import axios from "axios";
import { format } from "date-fns";
import { API_BASE_URL } from "./url";
import { Participant } from "./views";

export const goalsUrl = `${API_BASE_URL}/goals`;

export const goalsApi = axios.create({
  baseURL: goalsUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

export type GoalCategory = {
  id: number;
  name: string;
}

export type Goal = {
  id: number;
  title: string;
  creation_date: string;
  goal_review_date: string;
  last_update_date: string;
  status: "IN PROGRESS" | "RECALIBRATED" | "ACHIEVED";
  description: string;
  categories: GoalCategory[];
}

export type GoalDetail = Goal & {
  mentee?: Participant;
}

export type GoalInput = {
  title: string;
  goal_review_date: Date;
  mentee_id?: number | string;
  description: string;
  categories: GoalCategory[];
}

export type OrderingDate = "creation_date" | "goal_review_date" | "last_update_date";

export type GoalQuery = {
  limit: number;
  offset: number;
  status?: Goal["status"];
  categoryIds?: number[];
  orderingDate: OrderingDate;
  ascending?: boolean;
  search?: string;
}

export type GoalResult = {
  count: number,
  results: Goal[]
}

export const fetchGoals = async (query: GoalQuery = { limit: 5, offset: 0, orderingDate: "creation_date" }) => {
  let params: any = {
    limit: query.limit,
    offset: query.offset,
  }

  if (query.status) params.status = query.status;
  if (query.categoryIds && query.categoryIds.length > 0) params.categories = query.categoryIds.join(',');
  if (query.orderingDate) params.ordering = (!query.ascending ? '-' : '') + query.orderingDate;
  if (query.search) params.search = query.search;

  const apiRes = await goalsApi.get<GoalResult>("", {
    params
  });

  return apiRes.data;
};

export type GoalStatistics = {
  active: number;
  complete: number;
}

export const fetchGoalStatistics = async () => {
  try {
    const apiRes = await goalsApi.get<GoalStatistics>("statistics/")
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

export const exportGoals = async () => {
  const apiRes = await goalsApi.get<string>("export/");
  return apiRes.data
}