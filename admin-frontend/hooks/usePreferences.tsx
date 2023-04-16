import { useEffect, useState } from 'react'
import {
  Preference,
  fetchPreferences,
  updatePreferences
} from '../api/backend/perferences'

const usePreferences = () => {
  const [loadingPreferences, setLoadingPreferences] = useState(true)
  const [preferences, setPreferences] = useState([] as Preference[] | null)

  // Fetch the preferences
  useEffect(() => {
    fetchPreferences()
      .then((data) => {
        setPreferences(data)
      })
      .catch((_error) => console.log('Cannot fetch the questionnaire'))
      .finally(() => setLoadingPreferences(false))
  }, [])

  // Update preferences
  const handleUpdatePreferences = async (updatedPreferences: {
    searchingDurationInDays: string
    minimumActiveDays: string
  }) => {
    const searchingDurationInDaysPreference: Preference = {
      key: 'searchingDurationInDays',
      value: updatedPreferences.searchingDurationInDays
    }
    const minimumActiveDaysPreference: Preference = {
      key: 'minimumActiveDays',
      value: updatedPreferences.minimumActiveDays
    }
    return await updatePreferences(searchingDurationInDaysPreference)
      .then(async (result) => {
        const newPreferences: Preference[] = [searchingDurationInDaysPreference]
        return await updatePreferences(minimumActiveDaysPreference)
          .then((result) => {
            newPreferences.push(minimumActiveDaysPreference)
            setPreferences(newPreferences)
            return result
          })
          .catch((_error) =>
            console.log("Could not update 'Minimum Active Days'")
          )
      })
      .catch((_error) =>
        console.log("Could not update 'Searching Duration in Days'")
      )
  }

  const loading = loadingPreferences

  return {
    loading,
    preferences,
    handleUpdatePreferences
  }
}

export default usePreferences
