import { useEffect, useState } from 'react'
import { type Activity, getActivitiesForMentor } from '../api/misc'

/** Get activity list for the current mentor's mentor role from the backend
 * @returns
 * activities: loaded activities,
 * error: empty string if no errors loading, string with error reason if error occurred.
 */
const useActivities = () => {
  const [activities, setActivities] = useState<Activity[] | null>(null)
  const [error, setError] = useState<OnActivitiesFailedToLoadReason | ''>('')

  const getActivityData = async () => {
    try {
      const activities = await getActivitiesForMentor()
      if (!activities) {
        setError('Failed to load activities data')
        return
      }

      setActivities(activities)
    } catch {
      setError('An error has occurred')
    }
  }

  useEffect(() => {
    getActivityData()
  }, [])

  return { activities, error }
}

export type OnActivitiesFailedToLoadReason =
  | 'Failed to load activities data'
  | 'An error has occurred'

export default useActivities
