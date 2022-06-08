import { createContext, FunctionComponent, useContext, useEffect, useMemo, useState } from "react";
import {AppointmentModel} from "@devexpress/dx-react-scheduler"
import { fetchHolidays, Holiday } from "../api/misc";

const SchedulerContext = createContext({
  events: [] as AppointmentModel[],
  error: ""
})

const holidayToEvent = (holiday: Holiday) => {
  return {
    title: holiday.title,
    startDate: holiday.startDate,
    endDate: holiday.endDate,
    allDay: true,
    rRule: holiday.isAnnual ? "FREQ=YEARLY" : undefined
  } as AppointmentModel
}

export const SchedulerProvider: FunctionComponent<{}> = ({children}) => {
  const [holidays, setHolidays] = useState([] as Holiday[]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHolidays()
    .then(({data, error}) => {
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

  return <SchedulerContext.Provider value={{events, error}}>
    {children}
  </SchedulerContext.Provider>
};

export const useScheduler = () => {
  return useContext(SchedulerContext);
}
