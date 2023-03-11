import type { AxiosError, AxiosInstance } from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { refreshAccessToken } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const useRefreshToken = (api: AxiosInstance) => {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const prevRequest = error.config
        // Check for unauthorized error
        if (prevRequest && error.response?.status === 401) {
          // Refesh the access token
          const refreshed = await refreshAccessToken()

          // Resend the request if refresh was sucessful
          if (refreshed) return api(prevRequest)
          // Log out and Navigate back to login page for expired refresh token
          else {
            await signOut()
            return navigate('/login')
          }
        }
        return error
      }
    )
    return () => {
      // Eject this interceptor when the private routes unmounted
      api.interceptors.response.eject(interceptor)
    }
  }, [])
}

export default useRefreshToken
