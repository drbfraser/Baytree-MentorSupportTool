// fullcalendar bug in react-vite
// https://github.com/fullcalendar/fullcalendar/issues/6371
// Beware of formatter
import '@fullcalendar/react/dist/vdom'; // This must comes first
import FullCalendar, { ToolbarInput } from '@fullcalendar/react'; // this must comes second
import dayGridPlugin from '@fullcalendar/daygrid';
import interationPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import useScheduler from '../../hooks/useScheduler';

const Scheduler = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const calendarRef = useRef<FullCalendar | null>(null);
  const { fetchEvents, error } = useScheduler();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error])

  // Configure toolbar based on the views
  const headerToolbar: ToolbarInput = {
    left: 'prev,next today',
    center: !isMobile ? 'title' : undefined,
    right: isMobile ? 'title' : 'dayGridMonth,timeGridWeek,timeGridDay'
  }

  useEffect(() => {
    if (isMobile) {
      calendarRef.current?.getApi().changeView("timeGridDay");
    }
  }, [isMobile]);

  // TODO: Add handle click on the event
  const handleClick = (eventId: string) => {
    console.log(eventId);
  };

  return (
    <Paper elevation={4} sx={{ mb: 2 }}>
      <Box sx={{ p: 2 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interationPlugin, rrulePlugin]}
          initialView="timeGridDay"
          headerToolbar={headerToolbar}
          nowIndicator
          eventClick={({event}) => {
            handleClick(event.id)
          }}
          events={fetchEvents} />
      </Box>
    </Paper>
  )
};

export default Scheduler;