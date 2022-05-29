import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import styled from "styled-components";
import { getActivities } from "../api/backend/activities";
import {
  getMentorRoles,
  MentorRole,
  saveMentorRoles,
} from "../api/backend/mentorRoles";
import { getSessionGroupsFromViews } from "../api/backend/views/sessionGroups";
import DataGrid, {
  DataRow,
  onLoadDataRowsFunc,
  onSaveDataRowsFunc,
  PagedDataRows,
} from "../components/shared/datagrid/datagrid";

const MentorRoles: NextPage = () => {
  const MENTOR_ROLE_PAGE_SIZE = 2;

  const getMentorRoleData: onLoadDataRowsFunc = async (
    searchText,
    dataFieldsToSearch,
    limit,
    offset
  ) => {
    const mentorRolesPageRes = (await getMentorRoles(
      searchText,
      dataFieldsToSearch,
      limit,
      offset
    )) as PagedDataRows<MentorRole>;

    if (mentorRolesPageRes) {
      mentorRolesPageRes.results = mentorRolesPageRes.results.map(
        (mentorRole) => ({
          ...mentorRole,
          viewsSessionGroupId: mentorRole.viewsSessionGroupId,
        })
      );
      return mentorRolesPageRes;
    } else {
      throw "Failed to retrieve mentor role data.";
    }
  };

  const saveMentorRoleData: onSaveDataRowsFunc = async (
    dataRowChanges: DataRow[]
  ) => {
    const result = await saveMentorRoles(dataRowChanges);
    return !!result;
  };

  const getSessionGroupOptions = async () => {
    const response = await getSessionGroupsFromViews();
    if (response && response.status === 200 && response.data) {
      const sessionGroups = response.data;
      return sessionGroups.map((sessionGroup) => ({
        id: parseInt(sessionGroup.viewsSessionGroupId),
        name: sessionGroup.name,
      }));
    } else {
      throw "Failed to retrieve session group option data.";
    }
  };

  const getActivityOptions = async () => {
    const activities = await getActivities();

    if (activities) {
      return activities;
    } else {
      throw "Failed to retrieve activities option data.";
    }
  };

  return (
    <MentorRolesCard>
      <MentorRolesTitle variant="h5">Mentor Roles</MentorRolesTitle>
      <DataGrid
        cols={[
          { header: "Mentor Role", dataField: "name", enableSearching: true },
          {
            header: "Session Group",
            dataField: "viewsSessionGroupId",
            onLoadValueOptions: getSessionGroupOptions,
          },
          {
            header: "Activity",
            dataField: "activity",
            onLoadValueOptions: getActivityOptions,
          },
        ]}
        onLoadDataRows={getMentorRoleData}
        onSaveDataRows={saveMentorRoleData}
        pageSize={MENTOR_ROLE_PAGE_SIZE}
        isDataGridDeleteable={true}
      ></DataGrid>
    </MentorRolesCard>
  );
};

const MentorRolesCard = styled(Paper)`
  padding: 2rem;
`;

const MentorRolesTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

export default MentorRoles;
