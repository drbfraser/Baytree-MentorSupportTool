import { backendGet } from '../base'

export interface Questionnaire {
  viewsQuestionnaireId: number;
  title: string;
  description: string;
  created: string;
  updated: string;
  createdBy: string;
  updatedBy: string;
}

export const questionnairesFromViewsBackendEndpoint = 'views-api/questionnaires'
export const getQuestionnairesFromViews = async (params?: {
  limit?: number;
  offset?: number;
  title?: string;
}) => {
  const response = await backendGet<{ total: number; data: Questionnaire[] }>(
    questionnairesFromViewsBackendEndpoint,
    params
  )

  return response
}

export const getQuestionnaireFromViews = async (id: number) => {
  const response = await backendGet<Questionnaire>(
    questionnairesFromViewsBackendEndpoint,
    { id }
  )

  return response
}
