// fullcalendar bug in react-vite
// https://github.com/fullcalendar/fullcalendar/issues/6371
// Beware of formatter
import '@fullcalendar/react/dist/vdom'; // This must comes first
import FullCalendar, { ToolbarInput } from '@fullcalendar/react'; // this must comes second
import dayGridPlugin from '@fullcalendar/daygrid';
import interationPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, LinearProgress, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import useEventDetailPopup from '../../hooks/useEventDetailPopup';
import useScheduler, { EVENT_TYPE } from '../../hooks/useScheduler';
import RecordDetail from '../records/RecordDetail';

const Scheduler = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const calendarRef = useRef<FullCalendar | null>(null);
  const { fetchSessionEvents, holidayEvents, error, loading } = useScheduler();
  const { open, handleClose, event, handleEventId } = useEventDetailPopup();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error])

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
        {loading && <LinearProgress />}
        <Box sx={{ p: 2 }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interationPlugin, rrulePlugin]}
            initialView="timeGridDay"
            headerToolbar={headerToolbar}
            nowIndicator
            lazyFetching
            eventSources={[
              holidayEvents, // Static holiday events
              fetchSessionEvents // Lazily-fetched holidays
            ]}
            
            eventClick={({event}) => {
              handleEventId(event.id);
            }} />
        </Box>
      </Paper>
      {event.type === EVENT_TYPE.SESSION &&
        <RecordDetail sessionId={event.id} open={open} handleClose={handleClose} />}
    </>
  )
};

export default Scheduler;