import type { EventInput } from "@fullcalendar/react";
import { useEffect, useState } from "react";
import { fetchUkHolidays, type UkHoliday } from "../api/misc";
import { EVENT_TYPE } from "./useSessionEvents";

export const ukHolidayToCalendarEvent = (ukHoliday: UkHoliday) => {
  return {
    id: `${EVENT_TYPE.HOLIDAY}-${ukHoliday.id}`,
    title: ukHoliday.name,
    start: ukHoliday.date,
    end: ukHoliday.date,
    allDay: true,
    rrule: undefined
  } as EventInput;
};

const useUkHolidays = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([] as UkHoliday[]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUkHolidays()
      .then(({ data, error }) => {
        if (error) setError(error);
        else setEvents(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    loadingUkHolidays: loading,
    ukHolidays: events,
    ukHolidaysError: error
  };
};

export default useUkHolidays;
