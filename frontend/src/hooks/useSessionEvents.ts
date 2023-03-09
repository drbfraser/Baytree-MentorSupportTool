import type { EventInput, EventSourceFunc } from '@fullcalendar/react'
import { formatInTimeZone } from 'date-fns-tz'
import { useCallback, useState } from 'react'
import { fetchSessions, type SessionRecord } from '../api/records'
import { TIMEZONE_ID } from '../Utils/locale'
import { convertSessionDate } from '../Utils/sessionDate'

export enum EVENT_TYPE {
  SESSION = 'session',
  HOLIDAY = 'holiday'
}
export const EVENT_ID_REGEX = /(?<type>\w+)-(?<id>[0-9]+)/

export type SessionFilter = {
  attended: boolean;
  cancelled: boolean;
};

const sessionToEvent = (session: SessionRecord) => {
  const [start, end] = convertSessionDate(session)
  return {
    id: `${EVENT_TYPE.SESSION}-${session.viewsSessionId}`,
    title: session.name,
    start,
    end,
    color: session.cancelled === '0' ? '#5ab801' : '#ff1e89'
  } as EventInput
}

const useSessionEvents = (filter: SessionFilter) => {
  const [error, setError] = useState('')
  const [loadingSession, setLoadingSession] = useState(false)

  // Fetch sessions lazily
  const fetchSessionEvents = useCallback<EventSourceFunc>(
    ({ start, end }, success, fail) => {
      if (!filter.attended && !filter.cancelled) {
        success([])
        return
      }
      setLoadingSession(true)
      fetchSessions({
        startDateFrom: formatInTimeZone(start, TIMEZONE_ID, 'yyyy-MM-dd'),
        startDateTo: formatInTimeZone(end, TIMEZONE_ID, 'yyyy-MM-dd')
      })
        .then(({ data, error: sessionError }) => {
          if (data && !sessionError) {
            const result = [] as SessionRecord[]
            if (filter.attended)
              result.push(
                ...data.results.filter((session) => session.cancelled === '0')
              )
            if (filter.cancelled)
              result.push(
                ...data.results.filter((session) => session.cancelled === '1')
              )
            success(result.map(sessionToEvent))
          } else {
            setError(sessionError)
            fail({ message: sessionError })
          }
        })
        .catch(() => fail({ message: 'Cannot fetch session data' }))
        .finally(() => setLoadingSession(false))
    },
    [filter]
  )

  return { fetchSessionEvents, error, loadingSession }
}

export default useSessionEvents
