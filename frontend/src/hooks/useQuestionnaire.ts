import { useEffect, useMemo, useState } from "react";
import { Answer, fetchQuestions, Question } from "../api/misc";
import useMentees from "./useMentees";
import useMentorProfile from "./useProfile";

export const MENTOR_NAME_TAG = "mentor_name";
export const MENTEE_NAME_TAG = "mentee_name";

export const MENTOR_NAME = /mentor('s)? name/ig;
export const MENTEE_NAME = /mentee('s)? name/ig;

export const isRequired = (question: Question) => {
  return question.validation.includes("required");
}

export const isMentorQuestion = (q: Question) => !!q.Question.match(MENTOR_NAME);
export const isMenteeQuestion = (q: Question) => !!q.Question.match(MENTEE_NAME);

const useQuestionnaire = () => {
  const [loadingQuestionnaire, setLoadingQuestionniare] = useState(true);
  const { mentor, loadingMentor } = useMentorProfile();
  const { mentees, isLoadingMentees } = useMentees();
  const [questions, setQuestions] = useState([] as Question[]);

  // Fetch the question
  useEffect(() => {
    fetchQuestions()
      .then(setQuestions)
      .then(() => setLoadingQuestionniare(false))
      .catch((error) => console.error("Error: ", error));
    return () => setLoadingQuestionniare(false);
  }, []);

  // Generate the initital answers based on the question types
  // and the mentor and mentee profile
  const initialAnswer = useMemo(() => {
    let answer: Answer = {};
    for (const question of questions) {
      if (isMentorQuestion(question))
        answer[question.QuestionID] = mentor.viewsPersonId > 0 ? `${mentor.firstname} ${mentor.surname}` : "";
      else answer[question.QuestionID] = "";
    }
    answer["mentorId"] = `${mentor.viewsPersonId}`;
    return answer;
  }, [mentor, questions]);

  // Validate the answer based on the question requirement
  const validateAnswer = (answer: Answer) => {
    return questions
      .filter(isRequired)
      .every((q) => (answer[q.QuestionID] || "") !== "");
  }

  const loading = loadingQuestionnaire || loadingMentor || isLoadingMentees;

  // Validate
  const isValidQuestionnaire = useMemo(() => {
    const mentorQuestion = questions.filter(isMentorQuestion);
    const menteeQuestion = questions.filter(isMenteeQuestion);
    return mentorQuestion.length === 1 && menteeQuestion.length === 1;
  }, [questions])

  return { 
    loading, 
    questions, 
    initialAnswer, 
    validateAnswer, 
    isValidQuestionnaire,
    mentees }
}

export default useQuestionnaire;