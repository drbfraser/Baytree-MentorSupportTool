import { generateBackendGetFunc } from "../utils";

export interface MentorResponse {
  firstName: string;
  surName: string;
  viewsPersonId: string;
  email: string;
}
export const mentorsFromViewsBackendEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/mentors/from-views`;
export const getMentorsFromViews = generateBackendGetFunc<MentorResponse>(
  mentorsFromViewsBackendEndpoint
);
