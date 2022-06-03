import { useEffect, useState } from "react";
import { getVenues, Venue } from "../api/views";

/** Get venue list on views from the backend
 * @param onVenuesLoaded Handler called when venues are loaded
 * @param onVenuesFailedToLoad Handler called when venues failed to load
 * @returns
 * venues: loaded venues, isLoadingVenues: true if and only if venues are still loading
 */
const useVenues = (params?: {
  onVenuesLoaded?: (venues: Venue[]) => void;
  onVenuesFailedToLoad?: (reason: OnVenuesFailedToLoadReason) => void;
}) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);

  const onVenuesLoaded =
    params && params.onVenuesLoaded ? params.onVenuesLoaded : null;
  const onVenuesFailedToLoad =
    params && params.onVenuesFailedToLoad ? params.onVenuesFailedToLoad : null;

  const getVenueData = async () => {
    try {
      const venues = await getVenues();
      if (!venues.data) {
        if (onVenuesFailedToLoad) {
          onVenuesFailedToLoad("FAIL_LOAD_VENUES_ENDPOINT");
        }
        return;
      }

      setVenues(venues.data);

      if (onVenuesLoaded) {
        onVenuesLoaded(venues.data);
      }

      setIsLoadingVenues(false);
    } catch {
      if (onVenuesFailedToLoad) {
        onVenuesFailedToLoad("FAIL_LOAD_EXCEPTION");
      }
    }
  };

  useEffect(() => {
    getVenueData();
  }, []);

  return { venues, isLoadingVenues };
};

export type OnVenuesFailedToLoadReason =
  | "FAIL_LOAD_VENUES_ENDPOINT"
  | "FAIL_LOAD_EXCEPTION";

export default useVenues;
