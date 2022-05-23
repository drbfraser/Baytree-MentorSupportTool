/** REST endpoints for session activities */

import { backendGet } from "./base";

export interface Activity {
  id: number;
  name: string;
}

export const activitiesBackendEndpoint = `sessions/activities/`;

export const getActivities = async () => {
  return await backendGet<Activity>(activitiesBackendEndpoint);
};
