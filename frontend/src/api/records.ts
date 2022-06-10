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

type SessionRecord = {
  viewsSessionId: string;
  name: string;
  startDate: string;
  startTime: string;
  duration: string;
  cancelled: string;
}

export const fetchSession = async () => {
  try {
    const response = await recordsApi.get<{results: SessionRecord[]}>('');
    if (response.status === 200) return {data: response.data.results, error: ""}
    if (response.status === 404) return {data: undefined, error: "Cannot find any records"}
    else throw Error
  } catch (_) {
    return {data: undefined, error: "Cannot retrieve any records"}
  }
}

type SessionDetail = {
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
} & SessionRecord;

export const fetchSessionById = async (sessionId: number | string) => {
  try {
    const response = await recordsApi.get<SessionDetail>(`${sessionId}/`);
    if (response.status === 200) return {data: response.data, error: ""}
    if (response.status === 404) return {data: undefined, error: "Session not found"}
    else throw Error
  } catch (_) {
    return {data: undefined, error: "Cannot retrieve session"}
  }
} 