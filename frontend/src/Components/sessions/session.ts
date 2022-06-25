import axios from "axios";
import format from "date-fns/format";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api/url";

export interface SessionFormData {
  cancelled: boolean;
  date: Date;
  clockIn: Date;
  clockOut: Date;
  notes: string;
  viewsVenueId: string | number;
  menteeViewsPersonId: string | number;
}

export const getInitialFormValues = () =>
({
  cancelled: false,
  date: new Date(),
  clockIn: new Date(),
  clockOut: new Date(),
  notes: "",
  viewsVenueId: "",
  menteeViewsPersonId: ""
} as SessionFormData);

export interface Mentee {
  id: number;
  name: string;
}

const formatHM = (hours: number, minutes: number) => {
  const pad2Digits = (n: number) => n.toString().padStart(2, "0");
  return `${pad2Digits(hours)}:${pad2Digits(minutes)}`;
};

const getHoursAndMinutes = (time: Date) => ({
  hours: time.getHours(),
  minutes: time.getMinutes(),
  totalMinutes: time.getHours() * 60 + time.getMinutes()
});

export const submitSession = async (data: SessionFormData) => {
  const {
    cancelled,
    date,
    clockIn,
    clockOut,
    notes,
    viewsVenueId,
    menteeViewsPersonId
  } = data;

  // Preprocess the data
  const startTime = getHoursAndMinutes(clockIn);
  const endTime = getHoursAndMinutes(clockOut);
  const totalDurationInMinutes = endTime.totalMinutes - startTime.totalMinutes;

  const minutesDuration = totalDurationInMinutes % 60;
  const hoursDuration = (totalDurationInMinutes - minutesDuration) / 60;

  // Form the view sesssion
  const viewSession = {
    startDate: `${format(date, "yyyy-MM-dd")}`,
    startTime: formatHM(startTime.hours, startTime.minutes),
    duration: formatHM(hoursDuration, minutesDuration),
    notes,
    viewsVenueId,
    menteeViewsPersonId
  };

  try {
    let viewsSubmitSuccessful = true;
    let backendSubmitSuccessful = true;

    // only submit to views if session not missed/cancelled
    if (!cancelled) {
      const response = await axios.post(
        `${API_BASE_URL}/views-api/sessions`,
        viewSession,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      viewsSubmitSuccessful = response.status === 200;
    }

    if (viewsSubmitSuccessful && backendSubmitSuccessful) {
      toast.success("Session submitted successfully");
      return true;
    } else throw Error();
  } catch (err) {
    toast.error("Failed to submit session, please try again");
    return false;
  }
};
