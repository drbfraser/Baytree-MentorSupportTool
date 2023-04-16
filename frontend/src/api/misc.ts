import axios from 'axios'
import { API_BASE_URL } from './url'

export const baseApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// Questionnaire
export type Question = {
  enabled: string
  Question: string
  QuestionID: string
  category: string
  inputType:
    | 'text'
    | 'textarea'
    | 'number'
    | 'date'
    | 'radio'
    | 'checkselect'
    | 'select'
    | 'selectother'
    | 'phone_number'
    | 'time'
  validation: string
  valueList: { items: string[] }
}

export type AnswerSet = {
  [key: string]: string | string[] | undefined
}

export const submitAnswerSetForQuestionnaire = async (
  answerSet: AnswerSet,
  questionnaireId: number,
  person: string
) => {
  try {
    const respond = await baseApi.post(
      'views-api/questionnaires/answers/submit/',
      {
        answerSet,
        questionnaireId,
        person
      }
    )
    if (respond.status === 200) return respond
    else throw Error
  } catch (error) {
    return undefined
  }
}

export const fetchQuestions = () => {
  return baseApi
    .get<{ questionnaireId: number; questions: Question[] }>(
      'views-api/questionnaires/questions/'
    )
    .then((response) => ({
      questionnaireId: response.data.questionnaireId,
      questions: response.data.questions.filter((q) => q.enabled === '1')
    }))
}

// Resources
export const fetchResourcesURL = async () => {
  const { data } = await baseApi.get<string>('resources/')
  return data
}

// Sessions
// TODO: Update the session based on the schema frontend
export type Session = {
  SessionID: number
  Title: string
  StartDate: string
  Duration: string
  Status: string
  Snippet: string
  Note: string
}

export const fetchSessionListByMentorId = async (id: number) => {
  return baseApi.get<Session[]>(`records/${id}`).then((res) => res.data)
}

// Holidays
export type SpecialEvent = {
  id: number
  title: string
  startDate: string
  endDate: string
  isAnnual: boolean
  note?: string
}

// UK Holidays
export type UkHoliday = {
  id: number
  name: string
  date: string
}

export const fetchUkHolidays = async () => {
  try {
    const apiRes = await baseApi.get<UkHoliday[]>(
      'calendar_events/uk_holidays/'
    )
    if (apiRes.status === 200) return { data: apiRes.data, error: '' }
    throw Error
  } catch (err) {
    return { data: [] as UkHoliday[], error: 'Cannot fetch UK holiday data' }
  }
}

export const fetchSpecialEvents = async () => {
  try {
    const apiRes = await baseApi.get<SpecialEvent[]>('calendar_events/')
    if (apiRes.status === 200) return { data: apiRes.data, error: '' }
    throw Error
  } catch (err) {
    return { data: [] as SpecialEvent[], error: 'Cannot fetch holidays data' }
  }
}
export type Activity = string

export const getActivitiesForMentor = async () => {
  try {
    const apiRes = await baseApi.get<Activity[]>(
      'users/mentor-roles/activities'
    )
    if (apiRes.status === 200) return apiRes.data
    else return null
  } catch {
    return null
  }
}
export type Venue = {
  viewsVenueId: number
}

export const fetchVenues = async () => {
  try {
    const venues = await baseApi.get<Venue[]>('sessions/venues/')
    if (venues.status != 200 || !venues.data) {
      return null
    }
    return venues.data
  } catch {
    return null
  }
}
