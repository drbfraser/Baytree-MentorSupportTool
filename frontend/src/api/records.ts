import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "./url";

export const recordsApi = axios.create({
  baseURL: `${API_BASE_URL}/records/`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export interface SessionRecord {
  viewsSessionId: string;
  name: string;
  startDate: string;
  startTime: string;
  duration: string;
  cancelled: string;
}

type Params = {
  startDateFrom?: string;
  startDateTo?: string;
  limit?: number;
  offset?: number;
  sessionGroupId?: number;
  descending?: 0 | 1;
}

export const fetchSessions = async (params: Params = {descending: 0}) => {
  try {
    const response = await recordsApi.get<{count: number, results: SessionRecord[]}>('', { params });
    if (response.status === 200) return {data: response.data, error: ""}
    if (response.status === 404) return {data: undefined, error: "Cannot find any records"}
    else throw Error
  } catch (_) {
    return {data: undefined, error: "Cannot retrieve any records"}
  }
}

export interface SessionDetail extends SessionRecord {
  activity: string;
  sessionGroup?: {
    name: string;
    description: string;
  };
  mentee?: {
    menteeId: string;
    name: string;
  }
  note?: string;
  created: Date;
  updated: Date;
};

export const fetchSessionById = async (sessionId: number | string, signal?: AbortSignal) => {
  const response = await recordsApi.get<SessionDetail>(`${sessionId}/`, { signal });
  return response.data;
}

export const updateNoteBySeesionId = async (sessionId: number | string, note: string) => {
  try {
    await recordsApi.put(`${sessionId}/notes/`, {note});
    return {error: undefined}
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status == 404) return {error: "No records found"};
      if (error.response.status == 403) return {error: "You do have access to this session"};
      return {error: "Internal server error"};
    }
    return {error: "An error has occurs"}
  }
  
}