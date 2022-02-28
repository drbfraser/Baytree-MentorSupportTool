import { generateBackendGetFunc } from "../base";
import { API_BASE_URL } from "../url";

export interface SessionGroupResponse {
  viewsSessionGroupId: string;
  name: string;
  description: string;
  leadStaff: string; // ex. 1
  otherStaff: string; // ex. 13|2|3
}
export const sessionGroupsFromViewsBackendEndpoint = `${API_BASE_URL}/views-api/session-groups`;
export const getSessionGroupsFromViews = generateBackendGetFunc<SessionGroupResponse>(
    sessionGroupsFromViewsBackendEndpoint
);
