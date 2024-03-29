import { useEffect, useMemo, useState } from 'react'
import type { AnswerSet, Question } from '../api/misc'
import { fetchQuestions, submitAnswerSetForQuestionnaire } from '../api/misc'
import useMentees from './useMentees'
import useMentor from './useMentor'

export const MENTOR_NAME = /mentor('s)? name/gi
export const MENTEE_NAME = /mentee('s)? name/gi

export const isRequired = (question: Question) => {
  return question.validation.includes('required')
}

export const isMentorQuestion = (q: Question) => !!q.Question.match(MENTOR_NAME)
export const isMenteeQuestion = (q: Question) => !!q.Question.match(MENTEE_NAME)

const useQuestionnaire = () => {
  const [loadingQuestionnaire, setLoadingQuestionnaire] = useState(true)
  const [questionnaireId, setQuestionnaireId] = useState(-1)
  const { mentor, loadingMentor, error: mentorError } = useMentor()
  const { mentees, error: menteeError, loadingMentees } = useMentees()
  const [questions, setQuestions] = useState([] as Question[])
  const [questionsError, setQuestionnaireError] = useState<string | undefined>(
    undefined
  )

  const [LogMessage] = useState([])
  // Fetch the question
  useEffect(() => {
    fetchQuestions()
      .then((data) => {
        setQuestionnaireId(data.questionnaireId)
        setQuestions(data.questions)
      })
      .catch(() => setQuestionnaireError('Cannot fetch the questionnaire'))
      .finally(() => setLoadingQuestionnaire(false))
  }, [])

  // Generate the initital answers based on the question types
  // and the mentor and mentee profile
  const initialAnswer = useMemo(() => {
    const answerSet: AnswerSet = {}
    for (const question of questions) {
      if (isMentorQuestion(question))
        answerSet[question.QuestionID] =
          mentor.viewsPersonId > 0
            ? `${mentor.firstname} ${mentor.surname}`
            : ''
      else answerSet[question.QuestionID] = ''
    }
    return answerSet
  }, [mentor, questions])

  // Validate the answer based on the question requirement
  const validateAnswerSet = (answerSet: AnswerSet) => {
    return questions
      .filter(isRequired)
      .every((q) => (answerSet[q.QuestionID] || '') !== '')
  }

  const handleSubmitAnswerSet = async (
    answerSet: AnswerSet,
    person: string
  ) => {
    if (questionnaireId < 0) return undefined
    return await submitAnswerSetForQuestionnaire(
      answerSet,
      questionnaireId,
      person
    )
  }

  const loading = loadingQuestionnaire || loadingMentor || loadingMentees

  // Validate the questionnaire based on these condition
  // - Must have only one question for mentor's name
  // - Must have only one quesrion for mentee's name
  // - All questions must have input of type "text" or "number"
  const isValidQuestionnaire = useMemo(() => {
    return questions.length > 0
  }, [questions])

  useEffect(() => {
    //todo: add a boolean to toggle log or not
  }, [LogMessage])

  // Generate error based on the prvious errors
  // and the validaity of the questionnaire and datat set
  const errorMessage = () => {
    if (mentorError) return mentorError
    if (questionsError) return questionsError
    if (menteeError) return menteeError
    if (!isValidQuestionnaire)
      return 'The questionnaire is not correctly formatted'
    if (mentees && mentees.length <= 0)
      return 'The mentors does not any associate mentees'
    return ''
  }

  return {
    loading,
    questions,
    initialAnswer,
    validateAnswerSet,
    handleSubmitAnswerSet,
    errorMessage,
    mentees
  }
}

export default useQuestionnaire
