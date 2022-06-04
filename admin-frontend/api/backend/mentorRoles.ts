import { PagedDataRows } from "../../components/shared/datagrid/datagridTypes";
import { ApiOptions, backendGet, backendPost } from "./base";

export interface MentorRole {
  id: number;
  name: string;
  viewsQuestionnaireId: number;
  viewsSessionGroupId: number;
  activity: string;
}

export const mentorRolesBackendEndpoint = `users/mentor-roles/`;

export const getMentorRoles = async (options?: ApiOptions) => {
  const queryParams: Record<string, any> = {};

  if (options) {
    const { limit, offset, searchText, dataFieldsToSearch } = options;
    if (limit) {
      queryParams["limit"] = limit;
    }
    if (offset) {
      queryParams["offset"] = offset;
    }
    if (searchText && dataFieldsToSearch) {
      dataFieldsToSearch.forEach(
        (dataField) => (queryParams[`${dataField}__icontains`] = searchText)
      );
    }
  }

  return await backendGet<MentorRole[] | PagedDataRows<MentorRole>>(
    mentorRolesBackendEndpoint,
    queryParams
  );
};

export const saveMentorRoles = async (
  mentorRoleDataRows: Record<string, any>[]
) => {
  return await backendPost(mentorRolesBackendEndpoint, mentorRoleDataRows);
};
