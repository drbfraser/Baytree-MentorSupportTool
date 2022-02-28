import { generateBackendGetFunc } from "../base";
import { API_BASE_URL } from "../url";

export interface SessionResponse {
  viewsSessionId: string;
  viewsSessionGroupId: string;
  name: string;
  startDate: string;
  startTime: string;
  duration: string;
  cancelled: string;
  activity: string;
  leadStaff: string;
  venueId: string;
  created: string;
  updated: string;
  venueName: string;
}
export const sessionsFromViewsBackendEndpoint = `${API_BASE_URL}/views-api/sessions`;
export const getSessionsFromViews = generateBackendGetFunc<SessionResponse>(
    sessionsFromViewsBackendEndpoint
);
