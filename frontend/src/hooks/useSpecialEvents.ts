import { EventInput } from "@fullcalendar/react";
import { useEffect, useMemo, useState } from "react";
import { fetchSpecialEvents, SpecialEvent } from "../api/misc";
import { EVENT_TYPE } from "./useSessionEvents";

export const toCalendarEvent = (holiday: SpecialEvent) => {
  return {
    id: `${EVENT_TYPE.HOLIDAY}-${holiday.id}`,
    title: holiday.title,
    start: holiday.startDate,
    end: holiday.endDate,
    allDay: true,
    rrule: holiday.isAnnual ? {
      freq: 'yearly',
      dtstart: holiday.startDate
    } : undefined
  } as EventInput;
};

const useSpecialEvents = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([] as SpecialEvent[]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSpecialEvents()
      .then(({ data, error }) => {
        if (error) setError(error);
        else setEvents(data)
      }).finally(() => setLoading(false));
  }, []);

  return { loadingSpecialEvents: loading, specialEvents: events, specialEventError: error }
};

export default useSpecialEvents;