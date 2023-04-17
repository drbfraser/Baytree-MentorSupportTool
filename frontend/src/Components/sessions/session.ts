import axios from 'axios'
import format from 'date-fns/format'
import { toast } from 'react-toastify'
import { API_BASE_URL } from '../../api/url'

export type SessionFormData = {
  cancelled: boolean
  date: Date
  clockIn: Date
  clockOut: Date
  notes: string
  viewsVenueId: string | number
  menteeViewsPersonId: string | number
  activity: string
}

export const getInitialFormValues = () =>
  ({
    cancelled: false,
    date: new Date(),
    clockIn: new Date(),
    clockOut: new Date(),
    notes: '',
    viewsVenueId: '',
    menteeViewsPersonId: '',
    activity: ''
  } as SessionFormData)

export type Mentee = {
  id: number
  name: string
}

const formatHM = (hours: number, minutes: number) => {
  const pad2Digits = (n: number) => n.toString().padStart(2, '0')
  return `${pad2Digits(hours)}:${pad2Digits(minutes)}`
}

const getHoursAndMinutes = (time: Date) => ({
  hours: time.getHours(),
  minutes: time.getMinutes(),
  totalMinutes: time.getHours() * 60 + time.getMinutes()
})

export const submitSession = async (data: SessionFormData) => {
  const {
    cancelled,
    date,
    clockIn,
    clockOut,
    notes,
    viewsVenueId,
    menteeViewsPersonId,
    activity
  } = data

  // Preprocess the data
  const startTime = getHoursAndMinutes(clockIn)
  const endTime = getHoursAndMinutes(clockOut)
  const totalDurationInMinutes = endTime.totalMinutes - startTime.totalMinutes

  const minutesDuration = totalDurationInMinutes % 60
  const hoursDuration = (totalDurationInMinutes - minutesDuration) / 60

  // Form the view sesssion
  const viewSession = {
    startDate: `${format(date, 'yyyy-MM-dd')}`,
    startTime: formatHM(startTime.hours, startTime.minutes),
    duration: formatHM(hoursDuration, minutesDuration),
    notes,
    viewsVenueId,
    menteeViewsPersonId,
    activity,
    cancelled
  }

  try {
    let viewsSubmitSuccessful = true
    const backendSubmitSuccessful = true

    const response = await axios.post(
      `${API_BASE_URL}/views-api/sessions`,
      viewSession,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    )

    viewsSubmitSuccessful = response.status === 200

    if (viewsSubmitSuccessful && backendSubmitSuccessful) {
      toast.success('Session submitted successfully')
      return true
    } else throw Error()
  } catch (err) {
    toast.error(
      'Failed to submit session, please refresh the page and try again'
    )
    return false
  }
}
