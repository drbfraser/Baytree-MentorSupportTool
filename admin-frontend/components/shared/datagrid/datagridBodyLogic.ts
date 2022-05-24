import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { DataRow } from "./datagrid";

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
