import { useEffect, useState } from "react";
import { getVenues, Venue } from "../api/views";

/** Get venue list on views from the backend
 * @returns
 * venues: loaded venues,
 * error: empty string if no errors loading, string with error reason if error occurred.
 */
const useVenues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [error, setError] = useState<OnVenuesFailedToLoadReason | "">("");

  const getVenueData = async () => {
    try {
      const venues = await getVenues();
      if (!venues.data) {
        setError("FAIL_LOAD_VENUES_ENDPOINT");
        return;
      }

      setVenues(venues.data);
    } catch {
      setError("FAIL_LOAD_EXCEPTION");
    }
  };

  useEffect(() => {
    getVenueData();
  }, []);

  return { venues, error };
};

export type OnVenuesFailedToLoadReason =
  | "FAIL_LOAD_VENUES_ENDPOINT"
  | "FAIL_LOAD_EXCEPTION";

export default useVenues;
