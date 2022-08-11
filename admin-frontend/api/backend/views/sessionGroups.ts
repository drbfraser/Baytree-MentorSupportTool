import { backendGet } from "../base";
import { API_BASE_URL } from "../url";

export interface SessionGroupResponse {
  viewsSessionGroupId: string;
  name: string;
  description: string;
  leadStaff: string; // ex. 1
  otherStaff: string; // ex. 13|2|3
}
export const sessionGroupsFromViewsBackendEndpoint = `${API_BASE_URL}/views-api/session-groups`;

export const getSessionGroupsFromViews = async (
  params:
    | {
        limit: number;
        offset: number;
        name: string;
      }
    | undefined
) => {
  const response = await backendGet<{
    total: number;
    data: SessionGroupResponse[];
  }>(sessionGroupsFromViewsBackendEndpoint, params);

  return response;
};

export const getQuestionnaireFromViews = async (id: number) => {
  const response = await backendGet<SessionGroupResponse>(
    sessionGroupsFromViewsBackendEndpoint,
    { id }
  );

  return response;
};
