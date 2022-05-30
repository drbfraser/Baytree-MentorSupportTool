import axios from "axios";
import { API_BASE_URL } from "./url";

export const userApi = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export const createMentorAccount = async (
  password: string,
  createAccountLinkId: string
) => {
  const apiRes = await userApi.post("mentor/createAccount", {
    createAccountLinkId,
    password
  });
  return apiRes;
};

export const resetPassword = async (
  password: string,
  resetPasswordLinkId: string
) => {
  const apiRes = userApi.put("resetPassword", { resetPasswordLinkId, password });
  return apiRes;
};

export const sendPasswordResetEmail = async (email: string) => {
  const apiRes = await userApi.post("sendResetPasswordEmail", {
    email,
    accountType: "User"
  })

  return apiRes;
};

export const fetchMenteeListByMentorId = (id: number) => {
  return userApi.get("mentors", {
    params: { id }
  }).then(({ data }) => data.data[0].menteeUsers || []); // Why ???
}

export interface SessionsCount {
  sessions_attended: number;
  sessions_missed: number;
  sessions_remaining: number;
  sessions_total: number;
}

export const getSessionCount = async (mentorId: number) => {
  const response = await userApi.get<{ status: string, data: SessionsCount }>(
    "statistics/mentor",
    { params: { id: mentorId } });

  if (response.status === 200 && response.data.status === "success") {
    return response.data.data;
  }
};
