import { useEffect, useState } from 'react'
import {
  getSessionDetails,
  SessionDetails
} from '../api/backend/views/sessions'

const useSessionDetails = (viewsSessionId: number) => {
  const [sessionDetails, setSessionDetails] = useState<
    SessionDetails | null | undefined
  >(undefined)

  useEffect(() => {
    getSessionDetails(viewsSessionId).then((sessionDetails) => {
      setSessionDetails(sessionDetails)
    })
  }, [])

  return { sessionDetails }
}

export default useSessionDetails
