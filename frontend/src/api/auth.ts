import axios from "axios";
import { API_BASE_URL } from "./url";

interface LoginData {
  user_id: number;
  viewsPersonId: number;
  is_admin: boolean;
  is_mentor: boolean;
  is_superuser: boolean;
}

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/token/`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const login = async (email: string, password: string) => {
  try {
    const apiRes = await authApi.post<LoginData>("", { email, password });
    if (apiRes.status === 200) return { data: apiRes.data, error: "" };
    if (apiRes.status === 401)
      return { data: undefined, error: "Invalid email or password" };
    else throw Error;
  } catch (err) {
    return {
      data: undefined,
      error: "An error has occurred, please try again"
    };
  }
};

export const logout = async () => {
  try {
    const apiRes = await authApi.get("logout/");
    return apiRes.status === 200;
  } catch (err) {
    return false;
  }
};

export const verifyFetch = async () => {
  try {
    const apiRes = await authApi.post("verify/");
    return apiRes.status === 200;
  } catch (err) {
    return false;
  }
};

export const refreshAccessToken = async () => {
  try {
    const apiRes = await authApi.post("refresh/");
    return apiRes.status === 200;
  } catch (err) {
    return false;
  }
};

export const verify = async () => {
  try {
    const verified = await verifyFetch();
    if (!verified) {
      return await refreshAccessToken();
    }
    return true;
  } catch (err) {
    return false;
  }
};
