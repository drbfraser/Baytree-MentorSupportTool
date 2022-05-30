import { BackendGetResponse, generateBackendGetFunc } from "../base";
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

/** Get unparsed sessions from Django backend */
const getSessionsFromViewsBackendGetFunc =
  generateBackendGetFunc<SessionResponse>(sessionsFromViewsBackendEndpoint);

export interface Session {
  name: string;
  activity: string;
  leadStaff: string;
  venueName: string;
  viewsSessionId: string;
  viewsSessionGroupId: string;
  startDate: Date;
  durationInMinutes: number;
  cancelled: boolean;
  venueId: number;
  createdDate: Date;
  updatedDate: Date;
}

/** Wrapper function to get sessions from views while parsing the appropiate format for each field */
export const getSessionsFromViews = async (
  viewsSessionGroupId: string,
  limit?: number,
  offset?: number,
  startDateFrom?: string,
  startDateTo?: string
): Promise<BackendGetResponse<Session>> => {
  const filters: Record<string, any> = { sessionGroupId: viewsSessionGroupId };

  if (startDateFrom) {
    filters.startDateFrom = startDateFrom;
  }

  if (startDateTo) {
    filters.startDateTo = startDateTo;
  }

  const sessionsResponse = await getSessionsFromViewsBackendGetFunc(
    limit,
    offset,
    filters
  );

  if (sessionsResponse && sessionsResponse.data) {
    return {
      ...sessionsResponse,
      data: sessionsResponse.data.map((session) => ({
        activity: session.activity,
        name: session.name,
        leadStaff: session.leadStaff,
        venueName: session.venueName,
        viewsSessionId: session.viewsSessionId,
        viewsSessionGroupId: session.viewsSessionGroupId,
        startDate: new Date(
          Date.parse(`${session.startDate} ${session.startTime}:00`)
        ),
        durationInMinutes:
          parseInt(session.duration.split(":")[0]) * 60 +
          parseInt(session.duration.split(":")[0]),
        cancelled: session.cancelled === "1",
        venueId: parseInt(session.venueId),
        createdDate: new Date(Date.parse(`${session.created}`)),
        updatedDate: new Date(Date.parse(`${session.created}`)),
      })),
    };
  }

  return sessionsResponse;
};
