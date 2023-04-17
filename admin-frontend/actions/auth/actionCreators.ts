import { Dispatch } from 'react'
import { API_BASE_URL } from '../../api/backend/url'
import {
  LoginFailureActionType,
  LoginSuccessfulActionType,
  LogoutFailureActionType,
  LogoutSuccessfulActionType,
  VerifyFailureActionType,
  VerifyInProgressActionType,
  VerifySuccessActionType
} from './actionTypes'

interface AuthResponse {
  is_admin: boolean
  is_superuser: boolean
}

type LoginResponse = AuthResponse
type VerifyResponse = AuthResponse
type RefreshResponse = AuthResponse

/** async function that attempts to login the admin user with their email and password.
 If the login is successful, a value of true will be returned, and an action of
 LoginSuccessfulActionType will be dispatched, which will set the auth reducer
 state for isAuthenticated to true. If the login is not successful, false will be returned,
 and an action of LoginFailureActionType will be dispatched, which will set the auth reducer
 state for isAuthenticated to false. */
export const login =
  (email: string, password: string) =>
  async (
    dispatch: Dispatch<LoginSuccessfulActionType | LoginFailureActionType>
  ) => {
    const body = JSON.stringify({
      email,
      password
    })

    try {
      const apiRes = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: body
      })

      const data: LoginResponse = await apiRes.json()

      if (apiRes.status === 200 && (data.is_admin || data.is_superuser)) {
        dispatch({ type: 'LOGIN_SUCCESSFUL' })
        return true
      } else {
        dispatch({ type: 'LOGIN_FAILURE' })
        return false
      }
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE' })
      return false
    }
  }

/** async function that attempts to logout the admin user.
 If the logout is successful, a value of true will be returned, and an action of
 LogoutSuccessfulActionType will be dispatched, which will set the auth reducer
 state for isAuthenticated to false. If the logout is not successful, false will be returned,
 and an action of LogoutFailureActionType will be dispatched, which will set the auth reducer
 state for isAuthenticated to true. */
export const logout =
  () =>
  async (
    dispatch: Dispatch<LogoutSuccessfulActionType | LogoutFailureActionType>
  ) => {
    try {
      const apiRes = await fetch(`${API_BASE_URL}/token/logout/`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (apiRes.status === 200) {
        dispatch({ type: 'LOGOUT_SUCCESSFUL' })
        return true
      } else {
        dispatch({ type: 'LOGOUT_FAILURE' })
        return false
      }
    } catch (err) {
      await dispatch({ type: 'LOGOUT_FAILURE' })
      return false
    }
  }

/** async function that attempts to refresh the admin user's access token.
 if the refresh is successful, this function will return the successful fetch response which contains
 more information about the user, like is_admin and is_superuser. The admin user will be able to
 access the site for 30 more minutes until they have to refresh again. If the refresh failed,
 this function will return null, and they will not be able to access the site. */
export const refreshAccessToken = async () => {
  try {
    const apiRes = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    const data: RefreshResponse = await apiRes.json()

    return data
  } catch (err) {
    return null
  }
}

/** async function that attempts to make a request to the backend to verify the user's
 access token. if the verification is successful, this function will return the successful
 response which contains more information about the user, like is_admin and is_superuser. */
export const verifyFetch = async () => {
  try {
    const apiRes = await fetch(`${API_BASE_URL}/token/verify/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    const data: VerifyResponse = await apiRes.json()

    return data
  } catch (err) {
    return null
  }
}

/** async function that attempts to make a request to the backend to verify the user's
 access token. if the verification is successful, this function will dispatch an action
 of type VerifySuccessActionType and return true. Otherwise, it will return false and 
 dispatch an action of type VerifyFailureActionType. While the verification is in progress,
 an action of VerifyInProgressActionType will be dispatched, so that frontend code can
 display loading spinners to the user to inform that the page is still loading. */
export const verify =
  () =>
  async (
    dispatch: Dispatch<
      | VerifyInProgressActionType
      | VerifySuccessActionType
      | VerifyFailureActionType
    >
  ) => {
    try {
      await dispatch({ type: 'VERIFY_IN_PROGRESS' })
      const verifyResData = await verifyFetch()

      if (
        verifyResData &&
        (verifyResData.is_admin || verifyResData.is_superuser)
      ) {
        await dispatch({ type: 'VERIFY_SUCCESS' })
      } else {
        const refreshResData = await refreshAccessToken()

        if (
          refreshResData &&
          (refreshResData.is_admin || refreshResData.is_superuser)
        ) {
          await dispatch({ type: 'VERIFY_SUCCESS' })
        } else {
          await dispatch({ type: 'VERIFY_FAILURE' })
        }
      }
    } catch (err) {
      await dispatch({ type: 'VERIFY_FAILURE' })
    }
  }
