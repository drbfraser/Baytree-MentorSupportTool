import { backendGet, backendPost, DrfPageResponse } from "./base";

export interface MentorRole {
  id: number;
  name: string;
  viewsSessionGroupId: number;
  activity: number;
}

export const mentorRolesBackendEndpoint = `users/mentor-roles/`;

export const getMentorRoles = async (limit?: number, offset?: number) => {
  const queryParams: Record<string, any> = {};
  if (limit) {
    queryParams["limit"] = limit;
  }
  if (offset) {
    queryParams["offset"] = offset;
  }

  return await backendGet<MentorRole[] | DrfPageResponse>(
    mentorRolesBackendEndpoint,
    queryParams
  );
};

export const saveMentorRoles = async (
  mentorRoleDataRows: Record<string, any>[]
) => {
  return await backendPost(mentorRolesBackendEndpoint, mentorRoleDataRows);
};
