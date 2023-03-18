interface ParticipantUnparsed {
  firstName: string;
  lastName: string;
  viewsPersonId: number;
  email: string;
  ethnicity: string;
  country: string;
  firstLanguage: string;
}

interface ParticipantResponse extends ParticipantUnparsed {
  dateOfBirth: string;
}

export interface Participant extends ParticipantUnparsed {
  dateOfBirth: Date | null;
}

import { PagedDataRows } from '../../../components/shared/datagrid/datagridTypes'
import { backendGet } from '../base'

export const participantsEndpoint = 'views-api/participants'

export const getParticipantsFromViews = async (params?: {
  limit?: number;
  offset?: number;
  filters?: Record<string, string>;
}): Promise<PagedDataRows<Participant> | null> => {
  let queryParams: Record<string, any> = {}
  if (params) {
    if (params.limit) {
      queryParams['limit'] = params.limit
    }
    if (params.offset) {
      queryParams['offset'] = params.offset
    }
    if (params.filters) {
      queryParams = { ...queryParams, ...params.filters }
    }
  }

  const response = await backendGet<PagedDataRows<ParticipantResponse>>(
    participantsEndpoint,
    queryParams
  )

  if (response) {
    return {
      count: response.count,
      results: response.results.map((participant) => ({
        ...participant,
        dateOfBirth: isNaN(Date.parse(participant.dateOfBirth)) // is valid date?
          ? null
          : new Date(Date.parse(participant.dateOfBirth)),
      })),
    }
  } else {
    return null
  }
}
