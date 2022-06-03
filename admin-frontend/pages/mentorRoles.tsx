import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import styled from "styled-components";
import {
  getMentorRoles,
  MentorRole,
  saveMentorRoles,
} from "../api/backend/mentorRoles";
import { getQuestionnairesFromViews } from "../api/backend/views/questionnaires";
import { getSessionGroupsFromViews } from "../api/backend/views/sessionGroups";
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
        })
      );
      return mentorRolesPageRes;
    } else {
      throw "Failed to retrieve mentor role data.";
    }
  };

  const saveMentorRoleData: onSaveDataRowsFunc = async (
    createdRows: DataRow[],
    updatedRows: DataRow[],
    deletedRows: DataRow[]
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
