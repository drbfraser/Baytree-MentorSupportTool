import { API_BASE_URL } from "./url";

export interface MentorRole {
  id: number;
  name: string;
  viewsSessionGroupId: number;
  activity: number;
}

export const mentorRolesBackendEndpoint = `${API_BASE_URL}/users/mentor-roles/`;

export const getMentorRoles = async () => {
  const response = await fetch(mentorRolesBackendEndpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (response.ok) {
    try {
      const mentorRoles: MentorRole[] = await response.json();
      return mentorRoles;
    } catch {
      return null;
    }
  } else {
    return null;
  }
};

export const saveMentorRoles = async (
  mentorRoleDataRows: Record<string, any>[]
) => {
  try {
    const response = await fetch(mentorRolesBackendEndpoint, {
      method: "POST",
      body: JSON.stringify(mentorRoleDataRows),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return response.ok;
  } catch {
    return false;
  }
};
