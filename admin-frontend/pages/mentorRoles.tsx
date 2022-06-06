import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import styled from "styled-components";
import {
  getMentorRoles,
  MentorRole,
  saveMentorRoles,
} from "../api/backend/mentorRoles";
import { getActivitiesFromViews } from "../api/backend/views/activities";
import { getQuestionnairesFromViews } from "../api/backend/views/questionnaires";
import { getSessionGroupsFromViews } from "../api/backend/views/sessionGroups";
import { getVolunteeringTypesFromViews } from "../api/backend/views/volunteeringTypes";
import DataGrid from "../components/shared/datagrid/datagrid";
import {
  onLoadPagedDataRowsFunc,
  PagedDataRows,
  onSaveDataRowsFunc,
  DataRow,
} from "../components/shared/datagrid/datagridTypes";

const MentorRoles: NextPage = () => {
  const MENTOR_ROLE_PAGE_SIZE = 2;

  const getMentorRoleData: onLoadPagedDataRowsFunc = async ({
    searchText,
    dataFieldsToSearch,
    limit,
    offset,
  }) => {
    const mentorRolesPageRes = (await getMentorRoles({
      searchText,
      dataFieldsToSearch,
      limit,
      offset,
    })) as PagedDataRows<MentorRole>;

    if (mentorRolesPageRes) {
      mentorRolesPageRes.results = mentorRolesPageRes.results.map(
        (mentorRole) => ({
          ...mentorRole,
          viewsSessionGroupId: mentorRole.viewsSessionGroupId,
          exampleDate: "2022-06-06",
          exampleBool: true,
        })
      );
      return mentorRolesPageRes;
    } else {
      throw "Failed to retrieve mentor role data.";
    }
  };

  const saveMentorRoleData: onSaveDataRowsFunc<MentorRole> = async (
    createdRows: MentorRole[],
    updatedRows: MentorRole[],
    deletedRows: MentorRole[]
  ) => {
    const result = await saveMentorRoles([
      ...createdRows,
      ...updatedRows,
      ...deletedRows.map((row) => ({ ...row, isDeleted: true })),
    ]);
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

  const getQuestionnaireOptions = async () => {
    const response = await getQuestionnairesFromViews();
    if (response) {
      const questionnaires = response.data;
      return questionnaires.map((questionnaire) => ({
        id: questionnaire.viewsQuestionnaireId,
        name: questionnaire.title,
      }));
    } else {
      throw "Failed to retrieve questionnaires option data.";
    }
  };

  const getActivityOptions = async () => {
    const activities = await getActivitiesFromViews();
    if (activities) {
      return activities.results.map((activity) => ({
        id: activity,
        name: activity,
      }));
    } else {
      throw "Failed to retrieve activities option data.";
    }
  };

  const getVolunteeringOptions = async () => {
    const volunteeringTypes = await getVolunteeringTypesFromViews();
    if (volunteeringTypes) {
      return volunteeringTypes.results.map((volunteeringType) => ({
        id: volunteeringType,
        name: volunteeringType,
      }));
    } else {
      throw "Failed to retrieve volunteering type option data.";
    }
  };

  return (
    <MentorRolesCard>
      <MentorRolesTitle variant="h5">Mentor Roles</MentorRolesTitle>
      <DataGrid
        cols={[
          {
            header: "Mentor Role",
            dataField: "name",
            enableSearching: true,
            keepColumnOnMobile: true,
          },
          {
            header: "Session Group",
            dataField: "viewsSessionGroupId",
            onLoadValueOptions: getSessionGroupOptions,
          },
          {
            header: "Questionnaire",
            dataField: "viewsQuestionnaireId",
            onLoadValueOptions: getQuestionnaireOptions,
          },
          {
            header: "Activity",
            dataField: "activity",
            onLoadValueOptions: getActivityOptions,
          },
          {
            header: "Volunteering",
            dataField: "volunteeringType",
            onLoadValueOptions: getVolunteeringOptions,
          },
          {
            header: "Example Date",
            dataField: "exampleDate",
            dataType: "date",
          },
          {
            header: "Example Bool",
            dataField: "exampleBool",
            dataType: "boolean",
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
