/** REST endpoints for session activities */

import { API_BASE_URL } from "./url";

export interface Activity {
  id: number;
  name: string;
}

export const activitiesBackendEndpoint = `${API_BASE_URL}/sessions/activities/`;

export const getActivities = async () => {
  const response = await fetch(activitiesBackendEndpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (response.ok) {
    try {
      const activities: Activity[] = await response.json();
      return activities;
    } catch {
      return null;
    }
  } else {
    return null;
  }
};
