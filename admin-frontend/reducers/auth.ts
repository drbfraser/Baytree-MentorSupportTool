import { Action } from "redux";
import { AuthAction } from "../actions/types";

export interface AuthState {
  isAuthenticated: boolean;
  isVerifyInProgress: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isVerifyInProgress: true,
};

const authReducer = (
  state: AuthState = initialState,
  action: AuthAction
): AuthState => {
  const { type } = action;
  switch (type) {
    case "LOGIN_SUCCESSFUL":
      return { ...state, isAuthenticated: true };
    case "LOGIN_FAILURE":
      return { ...state, isAuthenticated: false };
    case "LOGOUT_SUCCESSFUL":
      return { ...state, isAuthenticated: false };
    case "LOGOUT_FAILURE":
      return { ...state, isAuthenticated: true };
    case "VERIFY_FAILURE":
      return { ...state, isAuthenticated: false, isVerifyInProgress: false };
    case "VERIFY_SUCCESS":
      return { ...state, isAuthenticated: true, isVerifyInProgress: false };
    case "VERIFY_IN_PROGRESS":
      return { ...state, isAuthenticated: false, isVerifyInProgress: true };
    default:
      return state;
  }
};

export default authReducer;
