import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  getMentorRoles,
  MentorRole,
  saveMentorRoles,
} from "../api/backend/mentorRoles";
import { getActivitiesFromViews } from "../api/backend/views/activities";
import {
  getQuestionnaireFromViews,
  getQuestionnairesFromViews,
} from "../api/backend/views/questionnaires";
import {
  getSessionGroupFromViews,
  getSessionGroupsFromViews,
} from "../api/backend/views/sessionGroups";
import { getVolunteeringTypesFromViews } from "../api/backend/views/volunteeringTypes";
import DataGrid from "../components/shared/datagrid/datagrid";
import {
  onSaveDataRowsFunc,
  onLoadDataRowsFunc,
  OnLoadColumnValueOptionsFunc,
  OnLoadPagedColumnValueOptionsFunc,
} from "../components/shared/datagrid/datagridTypes";

const MentorRoles: NextPage = () => {
  const getMentorRoleData: onLoadDataRowsFunc = async ({
    searchText,
    dataFieldsToSearch,
  }) => {
    const mentorRolesPageRes = (await getMentorRoles({
      searchText,
      dataFieldsToSearch,
    })) as MentorRole[];

    if (mentorRolesPageRes) {
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

  const getSessionGroupOptions: OnLoadPagedColumnValueOptionsFunc = async ({
    id,
    limit,
    offset,
    searchText,
  }) => {
    if (id) {
      const sessionGroup = await getSessionGroupFromViews(id);
      if (sessionGroup) {
        return {
          total: 1,
          data: [
            {
              id: parseInt(sessionGroup.viewsSessionGroupId),
              name: sessionGroup.name,
            },
          ],
        };
      } else {
        toast.error("Failed to retrieve initial session group option data");
        return { total: 0, data: [] };
      }
    } else {
      const response = await getSessionGroupsFromViews({
        limit,
        offset,
        name: searchText,
      });
      if (response) {
        const sessionGroups = response.data;
        return {
          total: response.total,
          data: sessionGroups.map((sessionGroup) => ({
            id: parseInt(sessionGroup.viewsSessionGroupId),
            name: sessionGroup.name,
          })),
        };
      } else {
        toast.error("Failed to retrieve session group option data.");
        return { total: 0, data: [] };
      }
    }
  };

  const getQuestionnaireOptions: OnLoadPagedColumnValueOptionsFunc = async ({
    id,
    limit,
    offset,
    searchText,
  }) => {
    if (id) {
      const questionnaire = await getQuestionnaireFromViews(id);
      if (questionnaire) {
        return {
          total: 1,
          data: [
            {
              id: questionnaire.viewsQuestionnaireId,
              name: questionnaire.title,
            },
          ],
        };
      } else {
        toast.error("Failed to retrieve initial questionnaire option data");
        return { total: 0, data: [] };
      }
    } else {
      const response = await getQuestionnairesFromViews({
        limit,
        offset,
        title: searchText,
      });
      if (response) {
        const questionnaires = response.data;
        return {
          total: response.total,
          data: questionnaires.map((questionnaire) => ({
            id: questionnaire.viewsQuestionnaireId,
            name: questionnaire.title,
          })),
        };
      } else {
        toast.error("Failed to retrieve questionnaires option data.");
        return { total: 0, data: [] };
      }
    }
  };

  const getActivityOptions: OnLoadColumnValueOptionsFunc = async () => {
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

  const getVolunteeringOptions: OnLoadColumnValueOptionsFunc = async () => {
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
      <MentorRolesTitle variant="h5">Settings</MentorRolesTitle>
      <DataGrid
        cols={[
          {
            header: "Mentor Role",
            dataField: "name",
            keepColumnOnMobile: true,
          },
          {
            header: "Session Group",
            dataField: "viewsSessionGroupId",
            onLoadPagedValueOptions: getSessionGroupOptions,
          },
          {
            header: "Questionnaire",
            dataField: "viewsQuestionnaireId",
            onLoadPagedValueOptions: getQuestionnaireOptions,
          },
          {
            header: "Activity",
            dataField: "activity",
            onLoadValueOptions: getActivityOptions,
            isMultiSelect: true,
          },
          {
            header: "Volunteering",
            dataField: "volunteeringType",
            onLoadValueOptions: getVolunteeringOptions,
          },
        ]}
        onLoadDataRows={getMentorRoleData}
        onSaveDataRows={saveMentorRoleData}
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
