import { EventInput, EventSourceFunc } from "@fullcalendar/react";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchHolidays, Holiday } from "../api/misc";
import { fetchSessions, SessionRecord } from "../api/records";
import { convertSessionDate } from "../Utils/sessionDate";

export enum EVENT_TYPE {
  SESSION = "session",
  HOLIDAY = "holiday"
}
export const EVENT_ID_REGEX = /(?<type>\w+)-(?<id>[0-9]+)/;

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

const sessionToEvent = (session: SessionRecord) => {
  const [start, end] = convertSessionDate(session);
  return {
    id: `${EVENT_TYPE.SESSION}-${session.viewsSessionId}`,
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

  const holidayEvents = useMemo(() => {
    return [
      ...holidays.map(holidayToEvent)
    ];
  }, [holidays]);

  // Fetch sessions lazily
  const fetchSessionEvents = useCallback<EventSourceFunc>(({ start, end }, success, fail) => {
    console.log("Fetching...");
    fetchSessions({
      startDateFrom: format(start, "yyyy-MM-dd"),
      startDateTo: format(end, "yyyy-MM-dd")
    }).then(({ data, error: sessionError }) => {
      if (data && !sessionError)
        success([
          ...data.map(sessionToEvent)
        ])
      else {
        setError(sessionError);
        fail({ message: sessionError });
      }
    }).catch(() => fail({ message: "Cannot fetch session data" }))
  }, []);

  return { fetchSessionEvents, holidayEvents, error };
};

export default useScheduler;