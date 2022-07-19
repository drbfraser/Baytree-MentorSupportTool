import { BackendGetFunction, generateBackendGetFunc } from "../base";
import { API_BASE_URL } from "../url";

interface VolunteerUnparsed {
  firstname: string;
  surname: string;
  viewsPersonId: string;
  email: string;
  ethnicity: string;
  country: string;
  firstLanguage: string;
}

interface VolunteerResponse extends VolunteerUnparsed {
  dateOfBirth: string;
}

export interface Volunteer extends VolunteerUnparsed {
  dateOfBirth: Date | null;
}

export const volunteersFromViewsBackendEndpoint = `${API_BASE_URL}/views-api/volunteers`;

const getVolunteersBackendFunc = generateBackendGetFunc<VolunteerResponse>(
  volunteersFromViewsBackendEndpoint
);

export const getVolunteersFromViews: BackendGetFunction<Volunteer> = async (
  limit?: number,
  offset?: number,
  filters?: Record<string, string>
) => {
  const backendResponse = await getVolunteersBackendFunc(
    limit,
    offset,
    filters
  );

  if (backendResponse && backendResponse.data) {
    return {
      ...backendResponse,
      data: backendResponse.data.map((volunteer) => ({
        ...volunteer,
        dateOfBirth: isNaN(Date.parse(volunteer.dateOfBirth)) // is valid date?
          ? null
          : new Date(Date.parse(volunteer.dateOfBirth)),
      })),
    };
  }

  return backendResponse;
};
