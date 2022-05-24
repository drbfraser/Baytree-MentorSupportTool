import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import styled from "styled-components";
import { getActivities } from "../api/backend/activities";
import { getMentorRoles, saveMentorRoles } from "../api/backend/mentorRoles";
import { getSessionGroupsFromViews } from "../api/backend/views/sessionGroups";
import DataGrid, {
  onSaveRowsFunc,
} from "../components/shared/datagrid/datagrid";

const MentorRoles: NextPage = () => {
  const getMentorRoleData = async () => {
    const mentorRoles = await getMentorRoles();

    if (mentorRoles) {
      return mentorRoles.map((mentorRole) => ({
        ...mentorRole,
        viewsSessionGroupId: mentorRole.viewsSessionGroupId,
      }));
    } else {
      throw "Failed to retrieve activities option data.";
    }
  };

  const saveMentorRoleData: onSaveRowsFunc = async (dataRows) => {
    return await saveMentorRoles(dataRows);
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
          { header: "Mentor Role", dataField: "name" },
          {
            header: "Session Group",
            dataField: "viewsSessionGroupId",
            onLoadSelectOptions: getSessionGroupOptions,
          },
          {
            header: "Activity",
            dataField: "activity",
            onLoadSelectOptions: getActivityOptions,
          },
        ]}
        onLoadData={getMentorRoleData}
        onSaveRows={saveMentorRoleData}
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
