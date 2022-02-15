import { Dispatch } from "react";
import {
  LoginFailureActionType,
  LoginSuccessfulActionType,
  LogoutFailureActionType,
  LogoutSuccessfulActionType,
  VerifyFailureActionType,
  VerifyInProgressActionType,
  VerifySuccessActionType,
} from "./actionTypes";

// Action Creators
export const login =
  (email: string, password: string) =>
  async (
    dispatch: Dispatch<LoginSuccessfulActionType | LoginFailureActionType>
  ) => {
    const body = JSON.stringify({
      email,
      password,
    });

    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/token/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: body,
        }
      );

      const data = await apiRes.json()

      if (apiRes.status === 200 && (data.is_admin || data.is_superuser)) {
        dispatch({ type: "LOGIN_SUCCESSFUL" });
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };

export const logout =
  () =>
  async (
    dispatch: Dispatch<LogoutSuccessfulActionType | LogoutFailureActionType>
  ) => {
    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/token/logout/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (apiRes.status === 200) {
        await dispatch({ type: "LOGOUT_SUCCESSFUL" });
      } else {
        await dispatch({ type: "LOGOUT_FAILURE" });
      }
    } catch (err) {
      await dispatch({ type: "LOGOUT_FAILURE" });
    }
  };

export const refreshAccessToken = async () => {
  try {
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/token/refresh/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return apiRes;
  } catch (err) {
    return null;
  }
};

export const verifyFetch = async () => {
  try {
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/token/verify/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return apiRes.status === 200;
  } catch (err) {
    return false;
  }
};

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
      await dispatch({ type: "VERIFY_IN_PROGRESS" });
      if (await verifyFetch()) {
        await dispatch({ type: "VERIFY_SUCCESS" });
      } else {
        if (await refreshAccessToken()) {
          await dispatch({ type: "VERIFY_SUCCESS" });
        } else {
          await dispatch({ type: "VERIFY_FAILURE" });
        }
      }
    } catch (err) {
      await dispatch({ type: "VERIFY_FAILURE" });
    }
  };
