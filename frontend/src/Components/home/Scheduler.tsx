// fullcalendar bus in react-vite
// https://github.com/fullcalendar/fullcalendar/issues/6371
import '@fullcalendar/react/dist/vdom';
import FullCalendar, { ToolbarInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interationPlugin from "@fullcalendar/interaction";
import { Paper, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef } from 'react';

const Scheduler = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const calendarRef = useRef<FullCalendar | null>(null);

  const headerToolbar: ToolbarInput = {
    left: 'prev,next today',
    center: !isMobile ? 'title' : undefined,
    right: isMobile ? 'title' : 'dayGridMonth,timeGridWeek,timeGridDay'
  }

  useEffect(() => {
    if (isMobile) {
      calendarRef.current?.getApi().changeView("timeGridDay");
    }
  }, [isMobile])

  return (
    <Paper elevation={4} sx={{p: 2, mb: 2}}>
      <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interationPlugin]}
      initialView="timeGridDay"
      headerToolbar={headerToolbar}
      nowIndicator />
    </Paper>
  )
};

export default Scheduler;