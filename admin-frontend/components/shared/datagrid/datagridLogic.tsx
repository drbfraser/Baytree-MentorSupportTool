import { MutableRefObject, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import {
  DataGridColumn,
  DataRow,
  onLoadDataRowsFunc,
  ValueOption,
} from "./datagrid";

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

export const isDataRowDeleted = (
  dataRow: DataRow,
  deletedDataRows: DataRow[],
  primaryKeyDataField: string
) =>
  !!deletedDataRows.find(
    (deletedDataRow) =>
      deletedDataRow[primaryKeyDataField] === dataRow[primaryKeyDataField]
  );

export const setChangedDataRow = (
  dataRows: DataRow[],
  changedDataRow: DataRow,
  originalDataRowsRef: MutableRefObject<DataRow[]>,
  changedDataRows: DataRow[],
  setChangedDataRows: Dispatch<SetStateAction<DataRow[]>>,
  primaryKeyDataField: string
) => {
  const dataRow = dataRows.find(
    (dataRow) =>
      dataRow[primaryKeyDataField] === changedDataRow[primaryKeyDataField]
  ) as DataRow;

  const originalDataRow = originalDataRowsRef.current.find(
    (originalDataRow) =>
      originalDataRow[primaryKeyDataField] ===
      changedDataRow[primaryKeyDataField]
  );

  if (originalDataRow) {
    if (areDataRowsEqual(originalDataRow, changedDataRow)) {
      originalDataRowsRef.current = originalDataRowsRef.current.filter(
        (row) =>
          row[primaryKeyDataField] !== changedDataRow[primaryKeyDataField]
      );

      changedDataRows = changedDataRows.filter(
        (row) =>
          row[primaryKeyDataField] !== changedDataRow[primaryKeyDataField]
      );

      setChangedDataRows(changedDataRows);
    } else {
      // changedDataRow may be the same object as existingChangedRow
      const changedDataRowClone = JSON.parse(JSON.stringify(changedDataRow));

      changedDataRows = changedDataRows.filter(
        (row) =>
          row[primaryKeyDataField] !== changedDataRow[primaryKeyDataField]
      );

      setChangedDataRows([...changedDataRows, changedDataRowClone]);
    }
  } else {
    originalDataRowsRef.current = [...originalDataRowsRef.current, dataRow];
    setChangedDataRows([...changedDataRows, changedDataRow]);
  }
};

export const areDataRowsEqual = (dataRow1: DataRow, dataRow2: DataRow) => {
  for (const key in dataRow1) {
    if (dataRow1[key] !== dataRow2[key]) {
      return false;
    }
  }

  return true;
};

export const setCreatedDataRow = (
  createdDataRow: DataRow,
  createdDataRows: DataRow[],
  primaryKeyDataField: string,
  setCreatedDataRow: Dispatch<SetStateAction<DataRow[]>>
) => {
  const existingRow = createdDataRows.find(
    (row) => row[primaryKeyDataField] === createdDataRow[primaryKeyDataField]
  );

  if (existingRow) {
    // createdDataRow may be the same object as existingRow
    const createdDataRowClone = JSON.parse(JSON.stringify(createdDataRow));

    createdDataRows = createdDataRows.filter(
      (row) => row[primaryKeyDataField] !== existingRow[primaryKeyDataField]
    );

    setCreatedDataRow([...createdDataRows, createdDataRowClone]);
  } else {
    setCreatedDataRow([...createdDataRows, createdDataRow]);
  }
};

export const setDeletedDataRow = (
  isDeleted: boolean,
  dataRow: DataRow,
  deletedDataRows: DataRow[],
  setDeletedDataRows: Dispatch<SetStateAction<DataRow[]>>,
  primaryKeyDataField: string
) => {
  if (isDeleted) {
    setDeletedDataRows([...deletedDataRows, dataRow]);
  } else {
    deletedDataRows = deletedDataRows.filter(
      (row) => row[primaryKeyDataField] !== dataRow[primaryKeyDataField]
    );

    setDeletedDataRows(deletedDataRows);
  }
};

export const createDataRow = (
  rowId: number,
  createdDataRows: DataRow[],
  setCreatedDataRows: Dispatch<SetStateAction<DataRow[]>>,
  columns: DataGridColumn[],
  primaryKeyDataField: string
) => {
  const newDataRow: DataRow = {};
  columns.forEach((col) => (newDataRow[col.dataField] = ""));
  newDataRow[primaryKeyDataField] = `created_${rowId}`;
  setCreatedDataRows([...createdDataRows, newDataRow]);
};

const failureLoadDataToastMessage =
  "Failed to load data. Please ensure that you have a stable internet connection and refresh the page. Otherwise, contact an administrator.";

export const loadDataRows = (
  onLoadDataRows: onLoadDataRowsFunc,
  setDataRows: Dispatch<SetStateAction<DataRow[]>>
) => {
  onLoadDataRows()
    .then((dataRows) => setDataRows(dataRows))
    .catch(() => toast.error(failureLoadDataToastMessage));
};

export const loadColumnValueOptions = (
  columns: DataGridColumn[],
  setColumns: Dispatch<SetStateAction<DataGridColumn[]>>
) => {
  const colsWithValueOptions = columns.filter(
    (col) => !!col.onLoadValueOptions
  );

  const colLoadFuncs = colsWithValueOptions.map((col) =>
    (col.onLoadValueOptions as () => Promise<ValueOption[]>)()
  ) as Promise<ValueOption[]>[];

  Promise.all(colLoadFuncs)
    .then((colResults) => {
      colsWithValueOptions.forEach(
        (col, i) => (col.valueOptions = colResults[i])
      );

      setColumns(columns);
    })
    .catch(() => toast.error(failureLoadDataToastMessage));
};
