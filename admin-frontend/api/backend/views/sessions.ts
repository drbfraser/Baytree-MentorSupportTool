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
  viewsSessionId: number;
  viewsSessionGroupId: number;
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
  offset?: number
): Promise<BackendGetResponse<Session>> => {
  const sessionsResponse = await getSessionsFromViewsBackendGetFunc(
    limit,
    offset,
    { sessionGroupId: viewsSessionGroupId }
  );

  if (sessionsResponse && sessionsResponse.data) {
    return {
      ...sessionsResponse,
      data: sessionsResponse.data.map((session) => ({
        activity: session.activity,
        name: session.name,
        leadStaff: session.leadStaff,
        venueName: session.venueName,
        viewsSessionId: parseInt(session.viewsSessionId),
        viewsSessionGroupId: parseInt(session.viewsSessionGroupId),
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
