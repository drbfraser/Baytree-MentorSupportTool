import { PagedDataRows } from '../../../components/shared/datagrid/datagridTypes'
import { backendGet } from '../base'

export const venuesEndpoint = 'views-api/venues'

export interface Venue {
  id: number
  name: string
}

export const getVenuesFromViews =
  async (): Promise<PagedDataRows<Venue> | null> => {
    return await backendGet(venuesEndpoint)
  }
