import { generateBackendGetFunc } from "../base";
import { API_BASE_URL } from "../url";

export interface VolunteerResponse {
  firstName: string;
  surName: string;
  viewsPersonId: string;
  email: string;
}
export const volunteersFromViewsBackendEndpoint = `${API_BASE_URL}/views-api/volunteers`;
export const getVolunteersFromViews = generateBackendGetFunc<VolunteerResponse>(
  volunteersFromViewsBackendEndpoint
);
