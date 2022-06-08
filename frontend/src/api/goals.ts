import axios from "axios";
import { API_BASE_URL } from "./url";
import { Participant } from "./views";

const goalsApi = axios.create({
  baseURL: `${API_BASE_URL}/goals/`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

interface Goal {
  id: number;
  mentee: Participant;
  title: string;
  creation_date: string;
  goal_review_date: string;
  status: string;
}

export const fetchAllGoals = async () => {
  try {
    const apiRes = await goalsApi.get<Goal[]>("");
    if (apiRes.status === 200)
      return {data: apiRes.data, error: undefined}
    if (apiRes.status === 404)
      return {data: undefined, error: "Cannot find users or goals"}
    else throw Error
  } catch (err) {
    return {data: undefined, error: "Cannot fetch goals"}
  }
};

export const fetchGoalByMentorId = async (id: number) => {
  const response = await goalsApi.get("goal/", {
    params: { mentor_id: id }
  });
  return response.data;
};

export const submitCompleteGoal = (goalId: any) => {
  return goalsApi.patch(`goal/${goalId}`, { status: "ACHIEVED" });
};

export const updateGoal = (goal: any, goalId?: any) => {
  if (!goalId) {
    return goalsApi.post("goal/", goal);
  }
  return goalsApi.patch(`goal/${goalId}`, goal);
};
