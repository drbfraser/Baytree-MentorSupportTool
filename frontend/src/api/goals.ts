import axios from "axios";
import { API_BASE_URL } from "./url";
import { Participant } from "./views";

const goalsApi = axios.create({
  baseURL: `${API_BASE_URL}/goals/`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

export interface Goal {
  id: number;
  mentee: Participant;
  title: string;
  creation_date: string;
  goal_review_date: string;
  last_update_date: string;
  status: "IN PROGRESS" | "RECALIBREATED" | "ACHIEVED";
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

export const submitCompleteGoal = (goalId: any) => {
  return goalsApi.put(`${goalId}/complete/`, { status: "ACHIEVED" });
};

export const updateGoal = (goal: any, goalId?: any) => {
  if (!goalId) {
    return goalsApi.post("", goal);
  }
  return goalsApi.put(`${goalId}`, goal);
};
