import { AppointmentModel } from "@devexpress/dx-react-scheduler";
import { useEffect, useMemo, useState } from "react";
import { fetchHolidays, Holiday } from "../api/misc";

const holidayToEvent = (holiday: Holiday) => {
  return {
    title: holiday.title,
    startDate: holiday.startDate,
    endDate: holiday.endDate,
    allDay: true,
    rRule: holiday.isAnnual ? "FREQ=YEARLY" : undefined,
    type: "Holiday"
  } as AppointmentModel
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
  
  return {events, error}
};

export default useScheduler;