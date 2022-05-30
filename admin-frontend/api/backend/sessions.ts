/**
  Endpoints for Mentor Sessions
*/

import { generateBackendCrudFuncs } from "./base";
import { API_BASE_URL } from "./url";

export interface SessionResponse {
  created_at: string; // format: 2022-03-22T14:06:01.692237-07:00
  updated_at: string; // format: 2022-03-22T14:06:01.692237-07:00
  mentor: number; // mentor id
  mentee: number; // mentee id
  attended_by_mentor: boolean;
  attended_by_mentee: boolean;
  clock_in: Date;
  clock_out: Date;
  notes: string;
  cancelled: boolean;
  viewsSessionId: string; // Matching session id in views
}

export const sessionsBackendEndpoint = `${API_BASE_URL}/sessions/`;

export const getSessions = async () => {
  try {
    const response = await fetch(`${sessionsBackendEndpoint}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return (await response.json()) as SessionResponse[];
  } catch {
    return null;
  }
};
