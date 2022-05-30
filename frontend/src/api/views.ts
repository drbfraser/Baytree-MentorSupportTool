import axios from "axios";
import { API_BASE_URL } from "./url";

export interface Mentor {
  firstname: string,
  surname: string,
  viewsPersonId: number,
  email: string,
  ethnicity?: string,
  country?: string
}

export const dummyMentor: Mentor = {
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
        data: dummyMentor,
        error: ""
      }
    }
    const apiRes = await viewsApi.get<Mentor>("/volunteers", {
      params: { id: viewsPersonId }
    });
    if (apiRes.status === 200)
      return { data: apiRes.data, error: "" }
    else throw Error
  } catch (err) {
    return { data: undefined, error: "Cannot retrieve the user" }
  }
}