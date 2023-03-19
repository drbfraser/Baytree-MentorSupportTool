import { PagedDataRows } from '../../../components/shared/datagrid/datagridTypes'
import { backendGet } from '../base'

export const activitiesEndpoint = 'views-api/activities'

export const getActivitiesFromViews =
  async (): Promise<PagedDataRows<string> | null> => {
    return await backendGet(activitiesEndpoint)
  }
