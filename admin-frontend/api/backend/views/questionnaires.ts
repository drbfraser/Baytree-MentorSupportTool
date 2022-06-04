import { backendGet } from "../base";

export interface Questionnaire {
  viewsQuestionnaireId: number;
  title: string;
  description: string;
  created: string;
  updated: string;
  createdBy: string;
  updatedBy: string;
}

export const questionnairesFromViewsBackendEndpoint = `views-api/questionnaires`;
export const getQuestionnairesFromViews = async () => {
  const response = await backendGet<{ total: number; data: Questionnaire[] }>(
    questionnairesFromViewsBackendEndpoint
  );

  return response;
};
