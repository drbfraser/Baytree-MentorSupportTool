import { useEffect, useState } from 'react'
import { fetchVenues } from '../api/misc'
import { getViewsVenues, type Venue } from '../api/views'

/** Get venue list on views from the backend
 * @returns
 * venues: loaded venues,
 * error: empty string if no errors loading, string with error reason if error occurred.
 */
const useVenues = () => {
  const [venues, setVenues] = useState<Venue[] | null>(null)
  const [error, setError] = useState<OnVenuesFailedToLoadReason | ''>('')

  const getVenueData = async () => {
    try {
      const viewsVenues = await getViewsVenues()
      if (!viewsVenues.data) {
        setError('Failed to load venues data')
        return
      }

      const venues = await fetchVenues()
      if (!venues) {
        setError('Failed to load venues data')
        return
      }

      // Only allow mentor selection of venues which are were selected in admin portal
      const allowedVenues = viewsVenues.data.filter((viewsVenue) =>
        venues.some((venue) => venue.viewsVenueId === viewsVenue.id)
      )

      setVenues(allowedVenues)
    } catch {
      setError('An error has occurred')
    }
  }

  useEffect(() => {
    getVenueData()
  }, [])

  return { venues, error }
}

export type OnVenuesFailedToLoadReason =
  | 'Failed to load venues data'
  | 'An error has occurred'

export default useVenues

