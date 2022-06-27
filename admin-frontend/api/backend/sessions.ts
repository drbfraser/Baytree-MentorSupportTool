/**
  Endpoints for Allowable session venues
*/

import { PagedDataRows } from "../../components/shared/datagrid/datagridTypes";
import { ApiOptions, backendGet, backendPost } from "./base";

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
