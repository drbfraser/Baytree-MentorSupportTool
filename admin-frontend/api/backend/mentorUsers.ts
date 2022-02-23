import { generateBackendCrudFuncs } from "./utils";

export type MentorUserStatus = "Active"
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

export const mentorUsersBackendEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/mentors`;

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
