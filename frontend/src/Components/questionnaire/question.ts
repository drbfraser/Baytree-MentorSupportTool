import axios from "axios";
import { API_BASE_URL } from "../../api/url";

export interface Question {
  enabled: string;
  Question: string;
  QuestionID: string;
  inputType: "text" | "number";
  validation: string;
}

export type Answer = {
  [key: string]: string | undefined;
};

export const validate = (question: Question[], answer: Answer) => {
  return question
    .filter((q) => q.enabled === "1" && q.validation.includes("required"))
    .every((q) => (answer[q.QuestionID] || "") !== "");
};

export const blankAnswers = (questions: Question[], mentorId?: number) => {
  let blank = questions
    .map((q) => q.QuestionID)
    .reduce((acc, id) => {
      acc[id] = "";
      return acc;
    }, {} as Answer);
  if (mentorId) blank["mentorId"] = `${mentorId}`;
  return blank;
};

export const submitAnswer = async (answer: Answer) => {
  try {
    const respond = await axios.post(`${API_BASE_URL}/questions/`, answer, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });
    return { respond, error: undefined };
  } catch (error) {
    return { respond: undefined, error };
  }
};

export const fetchQuestions = () => {
  return axios
    .get<{ [key: string]: Question }>(
      `${API_BASE_URL}/questionnaires/get_questionnaire/`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
    )
    .then((response) => Object.values(response.data))
    .then((questions) => questions.filter((q) => q.enabled === "1"));
};
