import { EventInput } from "@fullcalendar/react";
import { useEffect, useMemo, useState } from "react";
import { fetchHolidays, Holiday } from "../api/misc";
import { EVENT_TYPE } from "./useSessionEvents";

const holidayToEvent = (holiday: Holiday) => {
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

const useHolidayEvents = () => {
  const [loadingHoliday, setLoadingHoliday] = useState(true);
  const [holidays, setHolidays] = useState([] as Holiday[]);
  const [error, setError] = useState("");
  
  useEffect(() => {
    fetchHolidays()
      .then(({ data, error }) => {
        if (error) setError(error);
        else setHolidays(data)
      }).finally(() => setLoadingHoliday(false));
  }, []);

  const holidayEvents = useMemo(() => {
    return [
      ...holidays.map(holidayToEvent)
    ];
  }, [holidays]);

  return {loadingHoliday, holidays, holidayEvents, holidayError: error}
};

export default useHolidayEvents;