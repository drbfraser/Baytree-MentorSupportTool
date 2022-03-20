/**
  Endpoints creating/reading/updating/deleting Mentor User(s). Mentor Users are a sub-type of
  Django users, so a corresponding Django user must be created (via the endpoints in users.ts)
  before creating a Mentor User with these endpoints, and the Mentor User can be linked
  to this Django user by assigning the Django User id number to the "user" field in
  the MentorUserCreate interface below.
*/

import { generateBackendCrudFuncs } from "./base";
import { API_BASE_URL } from "./url";

export type MentorUserStatus =
  | "Active"
  | "Withdrawn"
  | "On Hold"
  | "Temporarily Withdrawn"
  | "Future Leaver"
  | "Staff"
  | "Inactive";

export interface MentorUserCreate {
  user: number;
  menteeUsers: number[];
  status: MentorUserStatus;
  viewsPersonId: string;
}

export interface MentorUserResponse {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  menteeUsers: number[];
  status: MentorUserStatus;
  viewsPersonId: string;
}

export type MentorUserUpdate = Partial<MentorUserCreate> & { id: number };

export const mentorUsersBackendEndpoint = `${API_BASE_URL}/users/mentors`;

export const {
  create: addMentorUser,
  read: getMentorUsers,
  update: updateMentorUser,
  delete: deleteMentorUser,
} = generateBackendCrudFuncs<
  MentorUserCreate,
  MentorUserResponse,
  MentorUserUpdate
>(mentorUsersBackendEndpoint);

export const sendMentorAccountCreationEmail = async (
  viewsPersonId: string,
  mentorFirstName: string,
  email: string
) => {
  try {
    const apiRes = await fetch(`${API_BASE_URL}/users/sendAccountCreationEmail`, {
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
    });

    return apiRes;
  } catch {
    return null;
  }
};
