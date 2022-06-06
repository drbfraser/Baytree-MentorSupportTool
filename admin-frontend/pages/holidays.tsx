import { Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import styled from "styled-components";
import DataGrid from "../components/shared/datagrid/datagrid";
import { 
    getHolidays,
    saveHolidays,
    Holiday,
    createHoliday,
    updateHoliday,
    deleteHoliday
} from "../api/backend/holidays";
import {
  onLoadPagedDataRowsFunc,
  PagedDataRows,
  onSaveDataRowsFunc,
  DataRow,
  onLoadDataRowsFunc,
} from "../components/shared/datagrid/datagridTypes";

const Holidays: NextPage = () => {

  const getHolidayData: onLoadDataRowsFunc = async ({
    searchText,
    dataFieldsToSearch,
  }) => {
    const holidays = await getHolidays();
    if (!holidays) {
        throw "Failed to get holidays.";
    }
    return holidays;
  };

  const saveHolidayData: onSaveDataRowsFunc<Holiday> = async (
    createdHolidays,
    updatedHolidays,
    deletedHolidays
  ) => {
   for (const createdHoliday of createdHolidays) {
    const result = await createHoliday(createdHoliday);
    if (!result) {
        return false;
    }
   }
   for (const updatedHoliday of updatedHolidays) {
    const result = await updateHoliday(updatedHoliday);
    if (!result) {
        return false;
    }
   }
   for (const deletedHoliday of deletedHolidays) {
    const result = await deleteHoliday(deletedHoliday.id);
    if (!result) {
        return false;
    }
   }
   return true;
  };

  return (
    <HolidaysCard>
      <HolidaysTitle variant="h5">Holidays</HolidaysTitle>
      <DataGrid
        cols={[
          {
            header: "Title",
            dataField: "title",
            keepColumnOnMobile: true,
          },
          {
            header: "Start Date",
            dataField: "startDate",
            dataType: "date",
          },
          {
            header: "End Date",
            dataField: "endDate",
            dataType: "date",
          },
          {
            header: "Is Annual",
            dataField: "isAnnual",
            dataType: "boolean",
          },
          {
            header: "Note",
            dataField: "note",
          },
        ]}
        onLoadDataRows={getHolidayData}
        onSaveDataRows={saveHolidayData}
      ></DataGrid>
    </HolidaysCard>
  );
};

const HolidaysCard = styled(Paper)`
  padding: 2rem;
`;

const HolidaysTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

export default Holidays;
