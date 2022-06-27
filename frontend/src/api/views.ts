import axios from "axios";
import { API_BASE_URL } from "./url";

export interface User {
  firstname: string;
  surname: string;
  viewsPersonId: number;
  email: string;
  dateOfBirth?: string;
  ethnicity?: string;
  country?: string;
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

export const getMentorProfile = async () => {
  try {
    const apiRes = await viewsApi.get<{ total: number; data: User[] }>(
      "/volunteers/volunteer/"
    );
    if (apiRes.status === 200 && apiRes.data.total > 0)
      return { data: apiRes.data.data[0], error: "" };
    else throw Error;
  } catch (err) {
    return { data: undefined, error: "Cannot retrieve mentor profile" };
  }
};

export interface Association {
  associationId: number;
  masterType: "Person" | "Staff";
  masterId: number;
  slaveType: "Person" | "Staff";
  slaveId: number;
  association: "Mentee" | "Mentor" | "Mother" | "Father";
  description: string | null;
  startDate: string; // ex. 2021-07-07
  endDate: string; // ex. 0000-00-00
}

export const getAssociations = async (volunteerId: number) => {
  try {
    const apiRes = await viewsApi.get<{
      count: number;
      results: Association[];
    }>("/associations", {
      params: { volunteerId: volunteerId }
    });
    if (apiRes.status === 200) return { data: apiRes.data.results, error: "" };
    else throw Error;
  } catch (err) {
    return {
      data: undefined,
      error: "Cannot retrieve associations for volunteer."
    };
  }
};

export interface Venue {
  id: number;
  name: string;
}

export const getViewsVenues = async () => {
  try {
    const apiRes = await viewsApi.get<{ count: number; results: Venue[] }>(
      "/venues"
    );
    if (apiRes.status === 200) return { data: apiRes.data.results, error: "" };
    else throw Error;
  } catch (err) {
    return { data: undefined, error: "Cannot retrieve venues" };
  }
};

export interface Participant {
  firstName: string;
  lastName: string;
  viewsPersonId: number;
  email: string | null;
  dateOfBirth: string;
  ethnicity: string;
  country: string;
}

export const getParticipants = async (params?: { ids: number[] }) => {
  let paramsString = "";
  if (params) {
    if (params.ids) {
      params.ids.forEach((id) => (paramsString += `&id=${id}`));
    }
  }

  try {
    const apiRes = await viewsApi.get<{
      count: number;
      results: Participant[];
    }>("/participants?" + paramsString);
    if (apiRes.status === 200) return { data: apiRes.data.results, error: "" };
    else throw Error;
  } catch (err) {
    return { data: undefined, error: "Cannot retrieve participants" };
  }
};

export const getMenteesForMentor = async () => {
  try {
    const apiRes = await viewsApi.get<Participant[]>("/mentor-mentees");
    if (apiRes.status === 200)
      return {
        data: apiRes.data,
        error: ""
      };
    else throw Error;
  } catch (err) {
    return {
      data: undefined,
      error: "Cannot retrieve mentees for current logged in mentor."
    };
  }
};
