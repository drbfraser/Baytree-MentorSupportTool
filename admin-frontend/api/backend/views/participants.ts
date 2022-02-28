import { BackendGetFunction, generateBackendGetFunc } from "../base";
import { API_BASE_URL } from "../url";

interface ParticipantUnparsed {
  firstname: string;
  surname: string;
  viewsPersonId: string;
  email: string;
  ethnicity: string;
  country: string;
}

interface ParticipantResponse extends ParticipantUnparsed {
  dateOfBirth: string;
}

export interface Participant extends ParticipantUnparsed {
  dateOfBirth: Date | null;
}

export const participantsFromViewsBackendEndpoint = `${API_BASE_URL}/views-api/participants`;

const getParticipantsBackendFunc = generateBackendGetFunc<ParticipantResponse>(
  participantsFromViewsBackendEndpoint
);

export const getParticipantsFromViews: BackendGetFunction<Participant> = async (
  limit?: number,
  offset?: number,
  filters?: Record<string, string>
) => {
  const backendResponse = await getParticipantsBackendFunc(
    limit,
    offset,
    filters
  );

  if (backendResponse && backendResponse.data) {
    return {
      ...backendResponse,
      data: backendResponse.data.map((participant) => ({
        ...participant,
        dateOfBirth: isNaN(Date.parse(participant.dateOfBirth)) // is valid date?
          ? null
          : new Date(Date.parse(participant.dateOfBirth)),
      })),
    };
  }

  return backendResponse;
};
