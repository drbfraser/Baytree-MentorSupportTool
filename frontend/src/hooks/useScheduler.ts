import { EventInput, EventSourceFunc } from "@fullcalendar/react";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { fetchHolidays, Holiday } from "../api/misc";
import { fetchSessions, SessionRecord } from "../api/records";
import { convertSessionDate } from "../Utils/sessionDate";

const holidayToEvent = (holiday: Holiday) => {
  return {
    id: `holiday-${holiday.id}`,
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

const sessionToEvent = (session: SessionRecord) => {
  const [start, end] = convertSessionDate(session);
  return {
    id: `session-${session.viewsSessionId}`,
    title: session.name,
    start,
    end
  } as EventInput;
}

const useScheduler = () => {
  const [holidays, setHolidays] = useState([] as Holiday[]);
  const [error, setError] = useState("");

  // Always fetch holiday first
  useEffect(() => {
    fetchHolidays()
      .then(({ data, error }) => {
        if (error) setError(error);
        else setHolidays(data)
      })
  }, []);

  // Composite all events
  const holidayEvents = useMemo(() => {
    return [
      ...holidays.map(holidayToEvent)
    ];
  }, [holidays]);

  // Fetch events
  const fetchEvents: EventSourceFunc = ({ start, end }, success, fail) => {
    fetchSessions({
      startDateFrom: format(start, "yyyy-MM-dd"),
      startDateTo: format(end, "yyyy-MM-dd")
    }).then(({ data, error: sessionError }) => {
      if (data && !sessionError)
        success([
          ...holidayEvents,
          ...data.map(sessionToEvent)
        ])
      else {
        setError(sessionError);
        fail({ message: sessionError });
      }
    }).catch(() => fail({ message: "Cannot fetch session data" }))
  }

  return { fetchEvents, error };
};

export default useScheduler;