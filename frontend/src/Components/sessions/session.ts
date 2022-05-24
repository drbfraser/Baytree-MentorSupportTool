import axios from "axios";
import format from "date-fns/format";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api/url";

export interface SessionFormData {
  cancelled: boolean,
  date: Date,
  clockIn: Date,
  clockOut: Date,
  notes: string
}

export const initialData = () => ({
  cancelled: false,
  date: new Date(),
  clockIn: new Date(),
  clockOut: new Date(),
  notes: "",
} as SessionFormData);

const formatHM = (hours: number, minutes: number) => {
  const pad2Digits = (n: number) => n.toString().padStart(2, "0");
  return `${pad2Digits(hours)}:${pad2Digits(minutes)}`
}

const getHoursAndMinutes = (time: Date) => ({
  hours: time.getHours(),
  minutes: time.getMinutes(),
  totalMinutes: time.getHours() * 60 + time.getMinutes()
})

export const submitSession = async (data: SessionFormData, mentorId: number) => {
  const {cancelled, date, clockIn, clockOut, notes} = data;
  
  // Preprocess the data
  const startTime = getHoursAndMinutes(clockIn);
  const endTime = getHoursAndMinutes(clockOut);
  const totalDurationInMinutes = endTime.totalMinutes - startTime.totalMinutes;
  
  const minutesDuration = totalDurationInMinutes % 60;
  const hoursDuration = (totalDurationInMinutes - minutesDuration) / 60;

  // Form the view sesssion
  const viewSession = {
    StartDate: `${format(date, "yyyy-MM-dd")}`,
    StartTime: formatHM(startTime.hours, startTime.minutes),
    Duration: formatHM(hoursDuration, minutesDuration),
    CancelledSession: cancelled ? "1" : "0",
    CancelledAttendee: cancelled ? "0" : "1",
    LeadStuff: `${mentorId}`,
    Notes: notes
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/sessions/viewsapp/`, viewSession, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    })
    if (response.status === 200) {
      toast.success("Session submitted successfully");
      return true;
    }
    else throw Error();
  } catch (err) {
    toast.error("Failed to submit session, please try again");
    return false;
  }
  
}