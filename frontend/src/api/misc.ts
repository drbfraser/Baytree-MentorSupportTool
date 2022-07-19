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
  questionnaireId: number,
  person: string
) => {
  try {
    const respond = await baseApi.post("questionnaires/questionnaire/submit/", {
      answerSet,
      questionnaireId,
      person
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
  const { data } = await baseApi.get<string>("resources/");
  return data;
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

// Holidays
export interface SpecialEvent {
  id: number,
  title: string,
  startDate: string,
  endDate: string,
  isAnnual: boolean,
  note?: string
}

export const fetchSpecialEvents = async () => {
  try {
    const apiRes = await baseApi.get<SpecialEvent[]>("calendar_events/");
    if (apiRes.status === 200)
      return { data: apiRes.data, error: "" }
    throw Error
  } catch (err) {
    return { data: [] as SpecialEvent[], error: "Cannot fetch holidays data" }
  }
}
export type Activity = string;

export const getActivitiesForMentor = async () => {
  try {
    const apiRes = await baseApi.get<Activity[]>(
      "users/mentor-roles/activities"
    );
    if (apiRes.status === 200) return apiRes.data;
    else return null;
  } catch {
    return null;
  }
};
export interface Venue {
  viewsVenueId: number;
}

export const fetchVenues = async () => {
  try {
    const venues = await baseApi.get<Venue[]>(`sessions/venues/`);
    if (venues.status != 200 || !venues.data) {
      return null;
    }
    return venues.data;
  } catch {
    return null;
  }
};
