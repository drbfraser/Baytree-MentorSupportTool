import { useEffect, useState } from "react";
import { Answer, fetchQuestions, Question } from "../api/misc";
import useMentorProfile from "./useProfile";

export const isAutoFilled = (question: Question) => {
  return question.category.includes("mentor_name");
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

  // Generate the initital answers
  useEffect(() => {
    let answer: Answer = {};
    for (const question of questions) {
      if (question.category.includes("mentor_name"))
        answer[question.QuestionID] = mentor.viewsPersonId > 0 ? `${mentor.firstname} ${mentor.surname}` : "";
      else answer[question.QuestionID] = "";
    }
    answer["mentorId"] = `${userId}`
    setInitialAnswer(answer);
  }, [mentor, questions])

  const validateAnswer = (answer: Answer) => {
    return questions
    .filter((q) => q.enabled === "1" && q.validation.includes("required"))
    .every((q) => (answer[q.QuestionID] || "") !== "");
  }

  return { loading, questions, initialAnswer, validateAnswer }
}

export default useQuestionnaire;