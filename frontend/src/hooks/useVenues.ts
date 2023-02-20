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
        setError('FAIL_LOAD_VENUES_ENDPOINT')
        return
      }

      const venues = await fetchVenues()
      if (!venues) {
        setError('FAIL_LOAD_VENUES_ENDPOINT')
        return
      }

      // Only allow mentor selection of venues which are were selected in admin portal
      const allowedVenues = viewsVenues.data.filter((viewsVenue) =>
        venues.some((venue) => venue.viewsVenueId === viewsVenue.id)
      )

      setVenues(allowedVenues)
    } catch {
      setError('FAIL_LOAD_EXCEPTION')
    }
  }

  useEffect(() => {
    getVenueData()
  }, [])

  return { venues, error }
}

export type OnVenuesFailedToLoadReason =
  | 'FAIL_LOAD_VENUES_ENDPOINT'
  | 'FAIL_LOAD_EXCEPTION'

export default useVenues

