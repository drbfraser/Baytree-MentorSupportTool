import { useEffect, useState } from "react";
import { Activity, getActivitiesForMentor } from "../api/misc";

/** Get activity list for the current mentor's mentor role from the backend
 * @returns
 * activities: loaded activities,
 * error: empty string if no errors loading, string with error reason if error occurred.
 */
const useActivities = () => {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [error, setError] = useState<OnActivitiesFailedToLoadReason | "">("");

  const getActivityData = async () => {
    try {
      const activities = await getActivitiesForMentor();
      if (!activities) {
        setError("FAIL_LOAD_ACTIVITIES_ENDPOINT");
        return;
      }

      setActivities(activities);
    } catch {
      setError("FAIL_LOAD_EXCEPTION");
    }
  };

  useEffect(() => {
    getActivityData();
  }, []);

  return { activities, error };
};

export type OnActivitiesFailedToLoadReason =
  | "FAIL_LOAD_ACTIVITIES_ENDPOINT"
  | "FAIL_LOAD_EXCEPTION";

export default useActivities;
