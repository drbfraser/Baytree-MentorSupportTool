import { ApiOptions, backendGet, backendPut } from './base'

export interface Preference {
  key: string
  value: string
}

export const preferencesBackendEndpoint = 'preferences/'

export const fetchPreferences = async (options?: ApiOptions) => {
  return await backendGet<Preference[]>(preferencesBackendEndpoint)
}

export const updatePreferences = async (preference: Preference) => {
  return await backendPut(
    `${preferencesBackendEndpoint}${preference.key}/`,
    preference
  )
}
