import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchSessionListByMentorId } from "../../api/misc";
import { useAuth } from "../../context/AuthContext";
import CalendarEvents from "../../Utils/CalendarEvents";

type Props = {
  height: string;
};

type Event = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  note: string;
  status: string;
};

const Scheduler: React.FC<Props> = ({ height }) => {
  const { user } = useAuth();
  const locales = {
    "en-US": enUS
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  });
  const [sessionList, setSessionList] = useState([] as any[]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [attended, setAttended] = useState("");
  const [note, setNote] = useState("");

  const handleEventClick = (session: any) => {
    setOpen(true);
    setTitle(session.title);
    setStartDate(session.start);
    setEndDate(session.end);
    setAttended(session.status);
    setNote(session.note);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const DurationToEndDate = (startDate: Date, duration: string) => {
    const durationHourMinute: any[] = duration.split(":");
    const endDate: Date = new Date(startDate);
    endDate.setHours(startDate.getHours() + parseInt(durationHourMinute[0]));
    endDate.setMinutes(
      startDate.getMinutes() + parseInt(durationHourMinute[1])
    );
    return endDate;
  };

  useEffect(() => {
    fetchSessionListByMentorId(user!.userId)
      .then((sessions) =>
        sessions.map<Event>((session, index) => ({
          title: `${session.Title} ${index + 1}`,
          start: new Date(session.StartDate),
          end: DurationToEndDate(new Date(session.StartDate), session.Duration),
          allDay: false,
          note: session.Note,
          status: session.Status
        }))
      )
      .then(setSessionList)
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      <Card sx={{ boxShadow: 2, p: 3, mb: 3 }} style={{ height: height }}>
        <Calendar
          localizer={localizer}
          events={[...sessionList, ...CalendarEvents]}
          onSelectEvent={handleEventClick}
        />
      </Card>
      <Dialog open={open} onClose={handleClose} scroll="paper">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>Status: {attended}</DialogContentText>
          <DialogContentText>
            Start Date and Time:{" "}
            {moment(startDate).format("YYYY/DD/MM hh:mm a")}
          </DialogContentText>
          <DialogContentText>
            End Date and Time: {moment(endDate).format("YYYY/DD/MM hh:mm a")}
          </DialogContentText>
          <DialogContentText>Note: {note}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Scheduler;
