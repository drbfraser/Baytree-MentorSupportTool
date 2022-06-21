import axios, { AxiosResponse } from "axios";
import { format } from "date-fns";
import { API_BASE_URL } from "./url";
import { Participant } from "./views";

const goalsApi = axios.create({
  baseURL: `${API_BASE_URL}/goals/`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

export interface Goal {
  id: number;
  mentee?: Participant;
  title: string;
  creation_date: string;
  goal_review_date: string;
  last_update_date: string;
  status: "IN PROGRESS" | "RECALIBREATED" | "ACHIEVED";
  description: string;
}

export interface GoalInput {
  title: string;
  goal_reivew_date: Date;
  mentee_id?: number | string;
  description: string;
}

export const fetchAllGoals = async () => {
  try {
    const apiRes = await goalsApi.get<Goal[]>("");
    if (apiRes.status === 200)
      return {data: apiRes.data, error: ""}
    if (apiRes.status === 404)
      return {data: undefined, error: "Cannot find users or goals"}
    else throw Error
  } catch (err) {
    return {data: undefined, error: "Cannot fetch goals"}
  }
};

export const submitGoal = async (input: GoalInput, id?: number) => {
  let data: any = {
    title: input.title,
    goal_review_date: format(input.goal_reivew_date, "yyyy-MM-dd"),
    description: input.description
  }
  console.log(data);
  if (input.mentee_id) data.mentee_id = +input.mentee_id;
  try {
    const promise = id ? goalsApi.put(`${id}/`, data) : goalsApi.post("", data);
    await promise;
    return true;
  } catch (err) {
    // Anything other than 2xx code
    return false;
  }
}

export const submitCompleteGoal = (goalId: any) => {
  return goalsApi.put(`${goalId}/complete/`, { status: "ACHIEVED" });
};

export const updateGoal = (goal: any, goalId?: any) => {
  if (!goalId) {
    return goalsApi.post("", goal);
  }
  return goalsApi.put(`${goalId}`, goal);
};
