import { EventInput, EventSourceFunc } from "@fullcalendar/react";
import { useEffect, useMemo, useState } from "react";
import { fetchHolidays, Holiday } from "../api/misc";

const holidayToEvent = (holiday: Holiday) => {
  return {
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

const useScheduler = () => {
  const [holidays, setHolidays] = useState([] as Holiday[]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHolidays()
      .then(({ data, error }) => {
        if (error) setError(error);
        else setHolidays(data)
      })
  }, []);

  // Composite all events
  const events = useMemo(() => {
    return [
      ...holidays.map(holidayToEvent)
    ];
  }, [holidays]);

  const fetchEvents: EventSourceFunc = ({ start, end }, success, fail) => {
    return success(events);
  }

  return { events, error }
};

export default useScheduler;