import axios from "axios";
import { API_BASE_URL } from "./url";

export interface User {
  firstname: string,
  surname: string,
  viewsPersonId: number,
  email: string,
  dateOfBirth?: string
  ethnicity?: string,
  country?: string
}

export const dummyUser: User = {
  firstname: "Super User",
  surname: "",
  viewsPersonId: -1,
  email: ""
};

const viewsApi = axios.create({
  baseURL: `${API_BASE_URL}/views-api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export const getMentorProfile = async (viewsPersonId?: number) => {
  try {
    if (!viewsPersonId) {
      return {
        data: dummyUser,
        error: ""
      }
    }
    const apiRes = await viewsApi.get<User>("/volunteers", {
      params: { id: viewsPersonId }
    });
    if (apiRes.status === 200)
      return { data: apiRes.data, error: "" }
    else throw Error
  } catch (err) {
    return { data: undefined, error: "Cannot retrieve the user" }
  }
}

export const fetchMenteeProfile = async () => {
  try {
    const apiRes = await viewsApi.get<User>("/volunteers/participants/");
    if (apiRes.status === 200)
      return { data: apiRes.data, error: "" }
    else throw Error
  } catch (err) {
    return { data: undefined, error: "Cannot retrieve the user" }
  }
}