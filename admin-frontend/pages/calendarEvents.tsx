import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import styled from "styled-components";
import DataGrid from "../components/shared/datagrid/datagrid";
import { 
    getCalendarEvents,
    saveCalendarEvents,
    CalendarEvent,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent
} from "../api/backend/calendarEvents";
import {
  onLoadPagedDataRowsFunc,
  PagedDataRows,
  onSaveDataRowsFunc,
  DataRow,
  onLoadDataRowsFunc,
} from "../components/shared/datagrid/datagridTypes";

const CalendarEvents: NextPage = () => {

  const getCalendarEventData: onLoadDataRowsFunc = async ({
    searchText,
    dataFieldsToSearch,
  }) => {
    const calendarEvents = await getCalendarEvents();
    if (!calendarEvents) {
        throw "Failed to get calendar events.";
    }
    return calendarEvents;
  };

  const saveCalendarEventData: onSaveDataRowsFunc<CalendarEvent> = async (
    createdCalendarEvents,
    updatedCalendarEvents,
    deletedCalendarEvents
  ) => {
   for (const createdCalendarEvent of createdCalendarEvents) {
    const result = await createCalendarEvent(createdCalendarEvent);
    if (!result) {
        return false;
    }
   }
   for (const updatedCalendarEvent of updatedCalendarEvents) {
    const result = await updateCalendarEvent(updatedCalendarEvent);
    if (!result) {
        return false;
    }
   }
   for (const deletedCalendarEvent of deletedCalendarEvents) {
    const result = await deleteCalendarEvent(deletedCalendarEvent.id);
    if (!result) {
        return false;
    }
   }
   return true;
  };

  return (
    <CalendarEventsCard>
      <CalendarEventsTitle variant="h5">Calendar Events</CalendarEventsTitle>
      <DataGrid
        cols={[
          {
            header: "Title",
            dataField: "title",
            keepColumnOnMobile: true,
          },
          {
            header: "Start Date",
            dataField: "startDate",
            dataType: "date",
          },
          {
            header: "End Date",
            dataField: "endDate",
            dataType: "date",
          },
          {
            header: "Is Annual",
            dataField: "isAnnual",
            dataType: "boolean",
          },
          {
            header: "Note",
            dataField: "note",
          },
        ]}
        onLoadDataRows={getCalendarEventData}
        onSaveDataRows={saveCalendarEventData}
      ></DataGrid>
    </CalendarEventsCard>
  );
};

const CalendarEventsCard = styled(Paper)`
  padding: 2rem;
`;

const CalendarEventsTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

export default CalendarEvents;
