import { Paper, Typography } from '@mui/material'
import { NextPage } from 'next'
import styled from 'styled-components'
import { getVenues, saveVenues, Venue } from '../api/backend/sessions'
import { getVenuesFromViews } from '../api/backend/views/venues'
import DataGrid from '../components/shared/datagrid/datagrid'
import {
  onSaveDataRowsFunc,
  onLoadDataRowsFunc,
  OnLoadColumnValueOptionsFunc
} from '../components/shared/datagrid/datagridTypes'

const MentorRoles: NextPage = () => {
  const getVenueData: onLoadDataRowsFunc = async () => {
    const venuesRes = (await getVenues()) as Venue[]

    if (venuesRes) {
      return venuesRes.map((venue) => ({
        id: venue.viewsVenueId, // need a separate id field for the grid primary key
        viewsVenueId: venue.viewsVenueId
      }))
    } else {
      throw 'Failed to retrieve venue data. Please refresh the page or contact IT if the issue persists.'
    }
  }

  // Necessary since the venue primary key is editable and the grid won't work
  type venueWithIdPrimaryKey = { id: number } & Venue
  const saveVenueData: onSaveDataRowsFunc<venueWithIdPrimaryKey> = async (
    createdRows: venueWithIdPrimaryKey[],
    updatedRows: venueWithIdPrimaryKey[],
    deletedRows: venueWithIdPrimaryKey[]
  ) => {
    const result = await saveVenues([
      ...createdRows,
      // Updating a row is deleting the updated row and creating a new one
      // since the primary key in this case for venues is editable
      ...updatedRows.map((row) => ({ viewsVenueId: row.viewsVenueId })),
      ...updatedRows.map((row) => ({
        id: row.id,
        viewsVenueId: row.id,
        isDeleted: true
      })),
      ...deletedRows.map((row) => ({ ...row, isDeleted: true }))
    ])
    return !!result
  }

  const getVenueOptions: OnLoadColumnValueOptionsFunc = async () => {
    const viewsVenues = await getVenuesFromViews()
    if (viewsVenues) {
      return viewsVenues.results.map((viewsVenue) => ({
        id: viewsVenue.id,
        name: viewsVenue.name
      }))
    } else {
      throw 'Failed to retrieve venue data from views. Please refresh the page or contact IT if the issue persists.'
    }
  }

  return (
    <VenuesCard>
      <VenuesTitle variant="h5">Venues</VenuesTitle>
      <DataGrid
        cols={[
          {
            header: 'Venue',
            dataField: 'viewsVenueId',
            onLoadValueOptions: getVenueOptions
          }
        ]}
        onLoadDataRows={getVenueData}
        onSaveDataRows={saveVenueData}
      ></DataGrid>
    </VenuesCard>
  )
}

const VenuesCard = styled(Paper)`
  padding: 2rem;
`

const VenuesTitle = styled(Typography)`
  margin-bottom: 1rem;
`

export default MentorRoles
