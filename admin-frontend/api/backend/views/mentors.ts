import { generateBackendGetFunc } from "../base";
import { API_BASE_URL } from "../url";

export interface MentorResponse {
  firstName: string;
  surName: string;
  viewsPersonId: string;
  email: string;
}
export const mentorsFromViewsBackendEndpoint = `${API_BASE_URL}/users/mentors/from-views`;
export const getMentorsFromViews = generateBackendGetFunc<MentorResponse>(
  mentorsFromViewsBackendEndpoint
);
