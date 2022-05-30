import { useEffect, useMemo, useState } from "react";
import { Answer, fetchQuestions, Question } from "../api/misc";
import useMentorProfile from "./useProfile";

export const MENTOR_NAME_TAG = "mentor_name";
export const MENTEE_NAME_TAG = "mentee_name";

export const isAutoFilled = (question: Question) => {
  return question.category.includes(MENTOR_NAME_TAG) || question.category.includes(MENTEE_NAME_TAG);
}

export const isRequired = (question: Question) => {
  return question.validation.includes("required");
}

const useQuestionnaire = () => {
  const [loading, setLoading] = useState(true);
  const { userId, mentor, mentee, loadingMentor, loadingMentee } = useMentorProfile();
  const [questions, setQuestions] = useState([] as Question[]);

  // Fetch the question
  useEffect(() => {
    fetchQuestions()
      .then(setQuestions)
      .then(() => setLoading(false))
      .catch((error) => console.error("Error: ", error));
    return () => setLoading(false);
  }, []);

  // Generate the initital answers based on the question types
  // and the mentor and mentee profile
  const initialAnswer = useMemo(() => {
    let answer: Answer = {};
    for (const question of questions) {
      if (question.category.includes(MENTOR_NAME_TAG))
        answer[question.QuestionID] = mentor.viewsPersonId > 0 ? `${mentor.firstname} ${mentor.surname}` : "";
      else if (question.category.includes(MENTEE_NAME_TAG))
        answer[question.QuestionID] = mentee.viewsPersonId > 0 ? `${mentee.firstname} ${mentee.surname}` : "";
      else answer[question.QuestionID] = "";
    }
    answer["mentorId"] = `${userId}`
    return answer;
  }, [mentor, mentee, questions]);

  // Validate the answer based on the question requirement
  const validateAnswer = (answer: Answer) => {
    return questions
    .filter(isRequired)
    .every((q) => (answer[q.QuestionID] || "") !== "");
  }

  const loadingQuestionnaire = useMemo(() => {
    console.log(loading, loadingMentor, loadingMentee)
    return loading || loadingMentor || loadingMentee;
  }, [loading, loadingMentee, loadingMentor])

  return { loading: loadingQuestionnaire, questions, initialAnswer, validateAnswer }
}

export default useQuestionnaire;