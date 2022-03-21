import { API_BASE_URL } from "./url";

export const createMentorAccount = async (
  password: string,
  createAccountLinkId: string
) => {
  const apiRes = await fetch(`${API_BASE_URL}/users/mentors/createAccount`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ createAccountLinkId, password }),
  });

  return apiRes;
};
