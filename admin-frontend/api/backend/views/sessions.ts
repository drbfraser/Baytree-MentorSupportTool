import { PagedDataRows } from "../../../components/shared/datagrid/datagridTypes";
import { backendGet } from "../base";

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

export const sessionsEndpoint = `views-api/sessions`;

export const getSessionsFromViews = async (
  viewsSessionGroupId: string,
  params?: {
    limit?: number;
    offset?: number;
    filters?: Record<string, string>;
    startDateFrom?: string;
    startDateTo?: string;
  }
): Promise<PagedDataRows<Session> | null> => {
  let queryParams: Record<string, any> = {
    sessionGroupId: viewsSessionGroupId,
  };

  if (params) {
    if (params.limit) {
      queryParams["limit"] = params.limit;
    }
    if (params.offset) {
      queryParams["offset"] = params.offset;
    }
    if (params.startDateFrom) {
      queryParams["startDateFrom"] = params.startDateFrom;
    }
    if (params.startDateTo) {
      queryParams["startDateTo"] = params.startDateTo;
    }
  }

  const response = await backendGet<PagedDataRows<SessionResponse>>(
    sessionsEndpoint,
    queryParams
  );

  if (response) {
    return {
      count: response.count,
      results: response.results.map((session) => ({
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
  } else {
    return null;
  }
};
