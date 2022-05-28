import { useEffect, useState } from "react";
import { Answer, fetchQuestions, Question } from "../api/misc";
import useMentorProfile from "./useProfile";

export const MENTOR_NAME_TAG = "mentor_name";
export const MENTEE_NAME_TAG = "mentee_name";

export const isAutoFilled = (question: Question) => {
  return question.category.includes(MENTOR_NAME_TAG);
}

export const isRequired = (question: Question) => {
  return question.validation.includes("required");
}

const useQuestionnaire = () => {
  const [loading, setLoading] = useState(true);
  const { userId, mentor } = useMentorProfile();
  const [questions, setQuestions] = useState([] as Question[]);
  const [initialAnswer, setInitialAnswer] = useState<Answer>({});

  // Fetch the question
  useEffect(() => {
    setLoading(true);
    fetchQuestions()
      .then(setQuestions)
      .then(() => setLoading(false))
      .catch((error) => console.error("Error: ", error));
    return () => setLoading(false);
  }, []);

  // Generate the initital answers based on the questionn types
  // and the user profile
  useEffect(() => {
    let answer: Answer = {};
    for (const question of questions) {
      if (question.category.includes(MENTOR_NAME_TAG))
        answer[question.QuestionID] = mentor.viewsPersonId > 0 ? `${mentor.firstname} ${mentor.surname}` : "";
      else answer[question.QuestionID] = "";
    }
    answer["mentorId"] = `${userId}`
    setInitialAnswer(answer);
  }, [mentor, questions])

  // Validate the answer based on the question requirement
  const validateAnswer = (answer: Answer) => {
    return questions
    .filter(isRequired)
    .every((q) => (answer[q.QuestionID] || "") !== "");
  }

  return { loading, questions, initialAnswer, validateAnswer }
}

export default useQuestionnaire;