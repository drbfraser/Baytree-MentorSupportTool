import { API_BASE_URL } from "./url";

export type MentorUserStatus =
  | "Active"
  | "Withdrawn"
  | "On Hold"
  | "Temporarily Withdrawn"
  | "Future Leaver"
  | "Staff"
  | "Inactive";

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

import { PagedDataRows } from "../../components/shared/datagrid/datagridTypes";
import { ApiOptions, backendGet, backendPost } from "./base";
import { MentorRole } from "./mentorRoles";

export interface MentorUser {
  user_id: number;
  user: User;
  status: MentorUserStatus;
  menteeUsers: any[];
  viewsPersonId: string;
  mentorRole: MentorRole | null;
}

export const mentorsBackendEndpoint = `users/mentors/`;

export const getMentorUsers = async (options?: ApiOptions) => {
  const queryParams: Record<string, any> = {};

  if (options) {
    const { searchText, dataFieldsToSearch, limit, offset } = options;
    if (limit) {
      queryParams["limit"] = limit;
    }
    if (offset) {
      queryParams["offset"] = offset;
    }
    if (searchText && dataFieldsToSearch) {
      dataFieldsToSearch.forEach((dataField) => {
        if (dataField === "email") {
          queryParams[`user__email__icontains`] = searchText;
        } else {
          queryParams[`${dataField}__icontains`] = searchText;
        }
      });
    }
  }

  return await backendGet<PagedDataRows<MentorUser>>(
    mentorsBackendEndpoint,
    queryParams
  );
};

export const saveMentorUsers = async (mentorUserDataRows: MentorUser[]) => {
  return await backendPost(mentorsBackendEndpoint, mentorUserDataRows);
};

export const sendMentorAccountCreationEmail = async (
  viewsPersonId: string,
  mentorFirstName: string,
  email: string
) => {
  try {
    const apiRes = await fetch(
      `${API_BASE_URL}/users/sendAccountCreationEmail`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          viewsPersonId,
          mentorFirstName,
          email,
          accountType: "Mentor",
        }),
      }
    );

    return apiRes;
  } catch {
    return null;
  }
};
