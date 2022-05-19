import { useState, useEffect } from "react";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import Card from "@mui/material/Card";
import Holidays from "../Utils/Holidays";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { API_BASE_URL } from "../api/url";

type Props = {
  height: string;
};

const Scheduler: React.FC<Props> = ({ height }) => {
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
    fetch(`${API_BASE_URL}/records/${localStorage.getItem("user_id")}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data: string) => {
        setSessionList(
          JSON.parse(data).map((values: any, index: any) => ({
            title: values.Title + " " + (index + 1),
            start: new Date(values.StartDate),
            end: DurationToEndDate(new Date(values.StartDate), values.Duration),
            allDay: false,
            note: values.Note,
            status: values.Status
          }))
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div>
      <Card sx={{ boxShadow: 2, p: 3, mb: 3 }} style={{ height: height }}>
        <Calendar
          localizer={localizer}
          events={[...sessionList, ...Holidays]}
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
