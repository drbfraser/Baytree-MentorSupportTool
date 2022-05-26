import { MutableRefObject, Dispatch, SetStateAction } from "react";
import { DataRow, onSaveDataRowsFunc } from "./datagrid";

export const saveDataRows = (
  createdDataRows: DataRow[],
  changedDataRows: DataRow[],
  deletedDataRows: DataRow[],
  onSaveDataRows: onSaveDataRowsFunc
) => {
  if (!onSaveDataRows) {
    return;
  }
};

export const getOriginalDataRow = (
  dataRow: DataRow,
  originalDataRows: DataRow[],
  primaryKeyDataField: string
) =>
  originalDataRows.find(
    (originalDataRow) =>
      originalDataRow[primaryKeyDataField] === dataRow[primaryKeyDataField]
  ) as DataRow;

export const getChangedDataRow = (
  dataRow: DataRow,
  changedDataRows: DataRow[],
  primaryKeyDataField: string
) =>
  changedDataRows.find(
    (changedDataRow) =>
      changedDataRow[primaryKeyDataField] === dataRow[primaryKeyDataField]
  ) as DataRow;

export const isDataRowDeleted = (dataRow: DataRow) => {};

export const setChangedDataRow = (
  changedDataRow: DataRow,
  originalDataRowsRef: MutableRefObject<DataRow[]>,
  setChangedDataRow: Dispatch<SetStateAction<DataRow[]>>
) => {};

export const setDeletedDataRow = (
  isDeleted: boolean,
  dataRow: DataRow,
  deletedDataRows: DataRow[],
  setDeletedDataRows: Dispatch<SetStateAction<DataRow[]>>
) => {};
