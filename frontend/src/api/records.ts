import axios from "axios";
import { API_BASE_URL } from "./url";

const recordsApi = axios.create({
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
}

export const fetchSessions = async (params: Params = {}) => {
  try {
    const response = await recordsApi.get<{results: SessionRecord[]}>('', { params });
    if (response.status === 200) return {data: response.data.results, error: ""}
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

export const fetchSessionById = async (sessionId: number | string, abort?: AbortController) => {
  try {
    const response = await recordsApi.get<SessionDetail>(`${sessionId}/`, {
      signal: abort?.signal
    });
    if (response.status === 200) return {data: response.data, error: ""}
    if (response.status === 404) return {data: undefined, error: "Session not found"}
    else throw Error
  } catch (err: any) {
    return {data: undefined, error: "Cannot retrieve session"}
  }
} 