import { addMinutes } from 'date-fns'
import type { SessionRecord } from '../api/records'

export const convertSessionDate = (session: SessionRecord) => {
  const [startH, startM] = session.startTime.split(':').map((m) => +m)
  const [durationH, durationM] = session.duration.split(':').map((m) => +m)
  const startTime = addMinutes(
    new Date(session.startDate),
    startH * 60 + startM
  )
  const endTime = addMinutes(startTime, durationH * 60 + durationM)
  return [startTime, endTime] as const
}
