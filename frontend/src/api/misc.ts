import axios from "axios";
import { API_BASE_URL } from "./url";

export const baseApi = axios.create({
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

export type AnswerSet = {
  [key: string]: string | undefined;
};

export const submitAnswerSetForQuestionnaire = async (
  answerSet: AnswerSet,
  questionnaireId: number
) => {
  try {
    const respond = await baseApi.post("questionnaires/questionnaire/submit/", {
      answerSet,
      questionnaireId
    });
    if (respond.status === 200) return respond;
    else throw Error;
  } catch (error) {
    return undefined;
  }
};

export const fetchQuestions = () => {
  return baseApi
    .get<{ questionnaireId: number; questions: Question[] }>(
      "questionnaires/questionnaire/"
    )
    .then((response) => ({
      questionnaireId: response.data.questionnaireId,
      questions: response.data.questions.filter((q) => q.enabled === "1")
    }));
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
  Note: string;
}

export const fetchSessionListByMentorId = async (id: number) => {
  return baseApi.get<Session[]>(`records/${id}`).then((res) => res.data);
};

export type Activity = string;

export const getActivitiesForMentor = async () => {
  try {
    const apiRes = await baseApi.get<Activity[]>(
      "users/mentor-roles/activities"
    );
    if (apiRes.status === 200) return apiRes.data;
    else return null;
  } catch (err) {
    return null;
  }
};
