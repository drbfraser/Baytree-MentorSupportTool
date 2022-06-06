import { PagedDataRows } from "../../components/shared/datagrid/datagridTypes";
import { ApiOptions, backendDelete, backendGet, backendPost, backendPut } from "./base";
import DateTime from "react-datetime";

export interface Holiday {
  id: number;
  title: string;
  startDate: DateTime; 
  endDate: DateTime;
  isAnnual: boolean;
  note: string;
}

export const holidaysBackendEndpoint = `holidays/`

export const getHolidays = async (options?: ApiOptions) => {
  const queryParams: Record<string, any> = {};

  return await backendGet<Holiday[]>(
    holidaysBackendEndpoint,
    queryParams
  );
};

export const createHoliday = async(holiday: Holiday) => {
    return await backendPost(holidaysBackendEndpoint, holiday);
};

export const deleteHoliday = async(holidayId: number) => {
    return await backendDelete(`${holidaysBackendEndpoint}/${holidayId}/`);
};

export const updateHoliday = async (holiday: Holiday) => {
    return await backendPut(holidaysBackendEndpoint, holiday);
};

export const saveHolidays = async (
  holidaysDataRows: Record<string, any>[]
) => {
  return await backendPost(holidaysBackendEndpoint, holidaysDataRows);
};
