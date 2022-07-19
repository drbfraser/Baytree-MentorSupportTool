import { MentorSessionsModalProps } from "../../../components/pages/home/MentorSessionTrackingCard/MentorSessionsModal";
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
        duration: session.duration,
        durationInMinutes:
          parseInt(session.duration.split(":")[0]) * 60 +
          parseInt(session.duration.split(":")[1]),
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

export interface SessionDetails {
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
  sessionGroup: SessionGroup;
  mentor: Mentor | null;
  mentee: Mentee | null;
  note: string | null;
}

interface SessionGroup {
  viewsSessionGroupId: string;
  name: string;
  description: string;
  leadStaff: string;
  otherStaff: string;
}

interface Mentor {
  firstname: string;
  surname: string;
  viewsPersonId: string;
  email: string;
  dateOfBirth: string;
  ethnicity: string;
  country: string;
}

interface Mentee {
  menteeId: string;
  name: string;
}

/** EXAMPLE RESPONSE FROM getSessionDetails()
 * {
    "viewsSessionId": "1",
    "viewsSessionGroupId": "4",
    "name": "'YS: Youth Mentoring 2021/2022' session",
    "startDate": "2021-09-22",
    "startTime": "17:00",
    "duration": "01:00",
    "cancelled": "0",
    "activity": "Youth mentoring",
    "leadStaff": "8",
    "venueId": "1",
    "created": "2021-09-24 12:27:06",
    "updated": "2021-09-24 12:27:06",
    "venueName": "Some Venue",
    "sessionGroup": {
        "viewsSessionGroupId": "4",
        "name": "YS: Youth Mentoring 2021/2022",
        "description": "Youth mentoring sessions run during the academic year 2021/2022. The sessions are run remotely or face-to-face for an hour.",
        "leadStaff": "8",
        "otherStaff": "6|1|43|74|48|76|79"
    },
    "mentor": null,
    "mentee": {
        "menteeId": "4",
        "name": "Maria Ramirez"
    },
    "note": null
}
 */

export const getSessionDetails = async (viewsSessionId: number) => {
  const sessionDetailsEndpoint = `records/${viewsSessionId}/`;
  const response = await backendGet<SessionDetails>(sessionDetailsEndpoint);
  return response;
};
