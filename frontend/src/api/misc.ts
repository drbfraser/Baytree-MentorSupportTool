import axios from "axios";
import { API_BASE_URL } from "./url";


const baseApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

// Questionnaire
export interface Question {
  enabled: string;
  Question: string;
  QuestionID: string;
  category: string;
  inputType: "text" | "number";
  validation: string;
}

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

// Resources
export const fetchResourcesURL = async () => {
  const { data } = await baseApi.get("resources/");
  return JSON.parse(data)[0].Resource as string;
};

// Sessions
// TODO: Update the session based on the schema frontend
export interface Session {
  SessionID: number;
  Title: string;
  StartDate: string;
  Duration: string;
  Status: string;
  Snippet: string;
  Note: string
}

export const fetchSessionListByMentorId = async (id: number) => {
  return baseApi.get<Session[]>(`records/${id}`).then((res) => res.data);
}