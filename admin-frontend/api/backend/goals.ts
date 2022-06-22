import { backendGet } from "./base";

export interface Goal {
  id: number;
  mentor?: {
    user: {
      email: string;
    }
  }
  mentee?: {
    firstName: string;
    lastName: string;
  }
  title: string;
  creation_date: string;
  goal_review_date: string;
  last_update_date: string;
  status: "IN PROGRESS" | "RECALIBREATED" | "ACHIEVED";
  description: string;
}

export const fetchAllGoals = () => {
  return backendGet<Goal[]>("goals/");
}