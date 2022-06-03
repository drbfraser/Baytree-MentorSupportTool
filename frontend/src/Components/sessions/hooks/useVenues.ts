import { MutableRefObject, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getVenues, Venue } from "../../../api/views";

const useVenues = (
  setFieldValueRef: MutableRefObject<
    | ((
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
      ) => void)
    | undefined
  >
) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);

  const getVenueData = async () => {
    try {
      const venues = await getVenues();
      if (!venues.data) {
        toast.error("Failed to retrieve venue data.");
      } else {
        setVenues(venues.data);

        if (venues.data.length > 0 && setFieldValueRef.current) {
          setFieldValueRef.current("viewsVenueId", venues.data[0].id, true);
        }

        setIsLoadingVenues(false);
      }
    } catch {
      toast.error("Failed to retrieve venue data.");
    }
  };

  useEffect(() => {
    getVenueData();
  }, []);

  return { venues, isLoadingVenues };
};

export default useVenues;
