import { useEffect, useState } from 'react'
import { getMenteesForMentor, type Participant } from '../api/views'
import { useAuth } from '../context/AuthContext'

/** Get mentees for the currently logged in mentor from backend
 * @returns
 * mentees: loaded mentees, null if mentees aren't loaded yet
 * error: null if no errors loading mentees, string with reason if an error occurred
 */
const useMentees = () => {
  const [mentees, setMentees] = useState<Participant[]>([])
  const [error, setError] = useState<OnMenteesFailedToLoadReason | ''>('')
  const { user } = useAuth()

  const getMenteeData = async () => {
    try {
      if (!user || !user.viewsPersonId) {
        setError('The current user is not valid')
        return
      }

      const { data: menteesResponse = [] } = await getMenteesForMentor()

      if (!menteesResponse) {
        setError('Failed to load mentees data')
        return
      }

      setMentees(menteesResponse)
    } catch {
      setError('An error has occurred')
    }
  }

  useEffect(() => {
    getMenteeData()
  }, [])

  return { mentees, error, loadingMentees: !mentees && !error }
}

export type OnMenteesFailedToLoadReason =
  | 'Failed to load mentees data'
  | 'The current user is not valid'
  | 'An error has occurred'

export default useMentees
