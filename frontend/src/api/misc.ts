import axios from "axios";
import { API_BASE_URL } from "./url";

export interface Question {
  enabled: string;
  Question: string;
  QuestionID: string;
  inputType: "text" | "number";
  validation: string;
}

const baseApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

export type Answer = {
  [key: string]: string | undefined;
};

export const submitAnswer = async (answer: Answer) => {
  try {
    const respond = await baseApi.post("questions/", answer);
    return { respond, error: undefined };
  } catch (error) {
    return { respond: undefined, error };
  }
};

export const fetchQuestions = () => {
  return baseApi
    .get<{ [key: string]: Question }>("questionnaires/get_questionnaire/")
    .then((response) => Object.values(response.data))
    .then((questions) => questions.filter((q) => q.enabled === "1"));
};

export const fetchResourcesURL = async () => {
  const { data } = await baseApi.get("resources/");
  return JSON.parse(data)[0].Resource as string;
};

export const fetchSessionListByMentorId = async (id: number) => {
  return baseApi.get(`records/${id}`).then((res) => res.data);
}