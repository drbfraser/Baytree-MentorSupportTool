import { PagedDataRows } from '../../../components/shared/datagrid/datagridTypes'
import { backendGet } from '../base'

export const volunteeringTypesEndpoint = 'views-api/volunteering-types'

export const getVolunteeringTypesFromViews =
  async (): Promise<PagedDataRows<string> | null> => {
    return await backendGet(volunteeringTypesEndpoint)
  }
