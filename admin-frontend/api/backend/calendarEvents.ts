import { PagedDataRows } from "../../components/shared/datagrid/datagridTypes";
import { ApiOptions, backendDelete, backendGet, backendPost, backendPut } from "./base";
import DateTime from "react-datetime";

export interface CalendarEvent {
  id: number;
  title: string;
  startDate: DateTime; 
  endDate: DateTime;
  isAnnual: boolean;
  note: string;
}

export const calendarEventsBackendEndpoint = `calendar_events/`

export const getCalendarEvents = async (options?: ApiOptions) => {
  const queryParams: Record<string, any> = {};

  return await backendGet<CalendarEvent[]>(
    calendarEventsBackendEndpoint,
    queryParams
  );
};

export const createCalendarEvent = async(calendarEvent: CalendarEvent) => {
    return await backendPost(`${calendarEventsBackendEndpoint}create/`, calendarEvent);
};

export const deleteCalendarEvent = async(calendarEventId: number) => {
    return await backendDelete(`${calendarEventsBackendEndpoint}${calendarEventId}/`);
};

export const updateCalendarEvent = async (calendarEvent: CalendarEvent) => {
    return await backendPut(`${calendarEventsBackendEndpoint}${calendarEvent.id}/`, calendarEvent);
};

export const saveCalendarEvents = async (
  calendarEventsDataRows: Record<string, any>[]
) => {
  return await backendPost(calendarEventsBackendEndpoint, calendarEventsDataRows);
};
