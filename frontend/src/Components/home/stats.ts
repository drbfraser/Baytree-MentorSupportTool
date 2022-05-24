import axios from "axios";
import { API_BASE_URL } from "../../api/url";

export interface SessionsCount {
  sessions_attended: number,
  sessions_missed: number,
  sessions_remaining: number,
  sessions_total: number
}

export const defaultCount: SessionsCount = {
  sessions_attended: 0,
  sessions_missed: 0,
  sessions_remaining: 0,
  sessions_total: 0
}

export const getSessionCount = async (mentorId: number) => {
  const response = await axios.get<{status: string, data: SessionsCount}>(
    `${API_BASE_URL}/users/statistics/mentor?id=${mentorId}`,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });

  if (response.status === 200 && response.data.status === "success") {
    return response.data.data;
  }
}