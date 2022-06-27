import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import styled from "styled-components";
import { getVenues, saveVenues, Venue } from "../api/backend/sessions";
import { getVenuesFromViews } from "../api/backend/views/venues";
import DataGrid from "../components/shared/datagrid/datagrid";
import {
  onSaveDataRowsFunc,
  onLoadDataRowsFunc,
} from "../components/shared/datagrid/datagridTypes";

const MentorRoles: NextPage = () => {
  const getVenueData: onLoadDataRowsFunc = async () => {
    const venuesRes = (await getVenues()) as Venue[];

    if (venuesRes) {
      return venuesRes;
    } else {
      throw "Failed to retrieve venue data. Please refresh the page or contact IT if the issue persists.";
    }
  };

  const saveVenueData: onSaveDataRowsFunc<Venue> = async (
    createdRows: Venue[],
    updatedRows: Venue[],
    deletedRows: Venue[]
  ) => {
    const result = await saveVenues([
      ...createdRows,
      ...updatedRows,
      ...deletedRows.map((row) => ({ ...row, isDeleted: true })),
    ]);
    return !!result;
  };

  const getVenueOptions = async () => {
    const viewsVenues = await getVenuesFromViews();
    if (viewsVenues) {
      return viewsVenues.results.map((viewsVenue) => ({
        id: viewsVenue.id,
        name: viewsVenue.name,
      }));
    } else {
      throw "Failed to retrieve venue data from views. Please refresh the page or contact IT if the issue persists.";
    }
  };

  return (
    <VenuesCard>
      <VenuesTitle variant="h5">Venues</VenuesTitle>
      <DataGrid
        primaryKeyDataField="viewsVenueId"
        cols={[
          {
            header: "Venue",
            dataField: "viewsVenueId",
            onLoadValueOptions: getVenueOptions,
          },
        ]}
        onLoadDataRows={getVenueData}
        onSaveDataRows={saveVenueData}
      ></DataGrid>
    </VenuesCard>
  );
};

const VenuesCard = styled(Paper)`
  padding: 2rem;
`;

const VenuesTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

export default MentorRoles;
