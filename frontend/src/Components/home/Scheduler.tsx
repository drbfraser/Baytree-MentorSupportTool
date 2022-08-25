// fullcalendar bug in react-vite
// https://github.com/fullcalendar/fullcalendar/issues/6371
// Beware of formatter
import '@fullcalendar/react/dist/vdom'; // This must comes first
import FullCalendar, { type ToolbarInput } from '@fullcalendar/react'; // this must comes second
import dayGridPlugin from '@fullcalendar/daygrid';
import interationPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, Checkbox, FormControlLabel, FormGroup, LinearProgress, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { type Id, toast } from 'react-toastify';
import useEventDetailPopup from '../../hooks/useEventDetailPopup';
import useSessionEvents, { EVENT_TYPE, type SessionFilter } from '../../hooks/useSessionEvents';
import useSpecialEvents, { toCalendarEvent } from '../../hooks/useSpecialEvents';
import useUkHolidays, { ukHolidayToCalendarEvent } from '../../hooks/useUkHolidays';
import { TIMEZONE_ID } from '../../Utils/locale';
import RecordDetail from '../records/RecordDetail';
import SpecialEventDetail from '../records/SpecialEventDetail';

const Scheduler = () => {
  // Theme states
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Checkbox states
  const [filter, setFilter] = useState<SessionFilter>({
    attended: true,
    cancelled: true
  });
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  // Calandar states
  const calendarRef = useRef<FullCalendar | null>(null);
  const { loadingUkHolidays, ukHolidaysError, ukHolidays } = useUkHolidays();
  const { loadingSpecialEvents, specialEventError, specialEvents } = useSpecialEvents();
  const { fetchSessionEvents, error, loadingSession } = useSessionEvents(filter);

  useEffect(() => {
    let id: Id;
    if (error) id = toast.error(error);
    return () => {
      if (id) toast.dismiss(id);
    }
  }, [error]);

  useEffect(() => {
    let id: Id;
    if (ukHolidaysError) id = toast.error(ukHolidaysError);
    return () => {
      if (id) toast.dismiss(id);
    }
  }, [ukHolidaysError]);

  useEffect(() => {
    let id: Id;
    if (specialEventError) id = toast.error(specialEventError);
    return () => {
      if (id) toast.dismiss(id);
    }
  }, [specialEventError]);

  // Dialog states
  const { open, handleClose, event, handleEventId } = useEventDetailPopup();

  // Configure toolbar based on the views
  const headerToolbar: ToolbarInput = {
    left: 'prev,next today',
    center: !isMobile ? 'title' : undefined,
    right: isMobile ? 'title' : 'dayGridMonth,timeGridWeek,timeGridDay'
  }

  // Change the calender into day views when user enter the mobile mode
  useEffect(() => {
    if (isMobile) {
      calendarRef.current?.getApi().changeView("timeGridDay");
    }
  }, [isMobile]);

  return (
    <>
      <Paper elevation={4} sx={{ mb: 2 }}>
        {(loadingUkHolidays || loadingSpecialEvents || loadingSession) && <LinearProgress sx={{ mt: "-4px" }} />}
        <Box sx={{ pt: 2, px: 2 }}>
          {/* Calender */}
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interationPlugin, rrulePlugin]}
            initialView="dayGridMonth"
            headerToolbar={headerToolbar}
            nowIndicator
            timeZone={TIMEZONE_ID}
            lazyFetching
            eventSources={[
              ukHolidays.map(ukHolidayToCalendarEvent),
              specialEvents.map(toCalendarEvent), // Static special events
              fetchSessionEvents // Lazily-fetched holidays
            ]}
            eventClick={({ event }) => {
              handleEventId(event.id);
            }}
          />
        </Box>
        {/* Checkbox */}
        <FormGroup row sx={{ px: 2 }}>
          <FormControlLabel
            label="Attended sessions"
            control={<Checkbox checked={filter.attended} onChange={handleCheckboxChange} name="attended" />} />
          <FormControlLabel
            label="Cancelled sessions"
            control={<Checkbox checked={filter.cancelled} onChange={handleCheckboxChange} name="cancelled" />} />
        </FormGroup>
      </Paper>
      {event.type === EVENT_TYPE.SESSION &&
        <RecordDetail sessionId={event.id} open={open} handleClose={handleClose} />}
      {event.type === EVENT_TYPE.HOLIDAY &&
        <SpecialEventDetail specialEvent={specialEvents.find(selected => selected.id === event.id)} open={open} handleClose={handleClose} />}
    </>
  )
};

export default Scheduler;