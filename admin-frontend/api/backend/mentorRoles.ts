import { backendGet, backendPost } from "./base";

export interface MentorRole {
  id: number;
  name: string;
  viewsSessionGroupId: number;
  activity: number;
}

export const mentorRolesBackendEndpoint = `users/mentor-roles/`;

export const getMentorRoles = async () => {
  return await backendGet<MentorRole>(mentorRolesBackendEndpoint);
};

export const saveMentorRoles = async (
  mentorRoleDataRows: Record<string, any>[]
) => {
  return await backendPost(mentorRolesBackendEndpoint, mentorRoleDataRows);
};
