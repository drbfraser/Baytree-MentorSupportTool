export interface LoginSuccessfulActionType {
  type: "LOGIN_SUCCESSFUL";
}

export interface LoginFailureActionType {
  type: "LOGIN_FAILURE";
}

export interface LogoutSuccessfulActionType {
  type: "LOGOUT_SUCCESSFUL";
}

export interface LogoutFailureActionType {
  type: "LOGOUT_FAILURE";
}

export interface VerifyFailureActionType {
  type: "VERIFY_FAILURE";
}

export interface VerifySuccessActionType {
  type: "VERIFY_SUCCESS";
}

export interface VerifyInProgressActionType {
  type: "VERIFY_IN_PROGRESS";
}

export type AuthAction =
  | LoginSuccessfulActionType
  | LoginFailureActionType
  | LogoutSuccessfulActionType
  | LogoutFailureActionType
  | VerifyFailureActionType
  | VerifySuccessActionType
  | VerifyInProgressActionType;
