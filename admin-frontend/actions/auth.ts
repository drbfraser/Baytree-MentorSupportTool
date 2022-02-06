import { Dispatch } from "react";
import {
  LoginFailureActionType,
  LoginSuccessfulActionType,
  LogoutFailureActionType,
  LogoutSuccessfulActionType,
  VerifyFailureActionType,
  VerifyInProgressActionType,
  VerifySuccessActionType,
} from "./types";

// Action Creators
export const login =
  (email: string, password: string) =>
  async (
    dispatch: Dispatch<LoginSuccessfulActionType | LoginFailureActionType>
  ) => {
    try {
      const apiRes = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (apiRes.status == 200) {
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
      const apiRes = await fetch(`/api/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (apiRes.status == 200) {
        dispatch({ type: "LOGOUT_SUCCESSFUL" });
      } else {
        dispatch({ type: "LOGOUT_FAILURE" });
      }
    } catch (err) {
      dispatch({ type: "LOGOUT_FAILURE" });
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

      const apiRes = await fetch(`/api/verify`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (apiRes.status !== 200) {
        await dispatch({ type: "VERIFY_FAILURE" });
      } else {
        await dispatch({ type: "VERIFY_SUCCESS" });
      }
    } catch (err) {
      await dispatch({ type: "VERIFY_FAILURE" });
    }
  };
