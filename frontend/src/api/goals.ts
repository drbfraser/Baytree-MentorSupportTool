import axios from "axios";
import { API_BASE_URL } from "./url";

const goalsApi = axios.create({
  baseURL: `${API_BASE_URL}/goals`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

export const fetchAllGoals = () => {
  return goalsApi.get("goal/").then((res) => res.data);
}

export const fetchGoalByMentorId = async (id: number)  => {
  const response = await goalsApi.get("goal/", {
    params: {mentor_id: id}
  });
  return response.data;
}

export const submitCompleteGoal = (goalId: any) => {
  return goalsApi.patch(`goal/${goalId}`, { status: "ACHIEVED" });
}

export const updateGoal = (goal: any, goalId?: any) => {
  if (!goalId) {
    return goalsApi.post("goal/", goal);
  }
  return goalsApi.patch(`goal/${goalId}`, goal);
}

