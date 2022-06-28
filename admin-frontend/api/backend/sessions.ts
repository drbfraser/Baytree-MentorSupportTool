import { PagedDataRows } from "../../components/shared/datagrid/datagridTypes";
import { ApiOptions, backendGet, backendPost } from "./base";
import { API_BASE_URL } from "./url";

/**
  Endpoints for Mentor Sessions and Allowable Venues
*/

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

export interface Venue {
  viewsVenueId: number;
}

export const venuesBackendEndpoint = `sessions/venues/`;

export const getVenues = async (options?: ApiOptions) => {
  const queryParams: Record<string, any> = {};

  if (options) {
    const { limit, offset } = options;
    if (limit) {
      queryParams["limit"] = limit;
    }
    if (offset) {
      queryParams["offset"] = offset;
    }
  }

  return await backendGet<Venue[] | PagedDataRows<Venue>>(
    venuesBackendEndpoint,
    queryParams
  );
};

export const saveVenues = async (venueDataRows: Record<string, any>[]) => {
  return await backendPost(venuesBackendEndpoint, venueDataRows);
};
