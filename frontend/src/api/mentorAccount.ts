import { API_BASE_URL } from "./url";

export const createMentorAccount = async (
  password: string,
  createAccountLinkId: string
) => {
  const apiRes = await fetch(`${API_BASE_URL}/users/mentors/createAccount`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ createAccountLinkId, password })
  });

  return apiRes;
};

export const resetPassword = async (
  password: string,
  resetPasswordLinkId: string
) => {
  const apiRes = await fetch(`${API_BASE_URL}/users/resetPassword`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      resetPasswordLinkId: resetPasswordLinkId,
      password
    })
  });

  return apiRes;
};

export const sendPasswordResetEmail = async (email: string) => {
  const apiRes = await fetch(`${API_BASE_URL}/users/sendResetPasswordEmail`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      email: email,
      accountType: "Mentor"
    })
  });

  return apiRes;
};
