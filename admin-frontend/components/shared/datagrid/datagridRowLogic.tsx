import { MdDelete, MdRestoreFromTrash } from "react-icons/md";
import {
  DataRow,
  DataRowAction,
  DataGridColumn,
  setChangedDataRowFunc,
  setCreatedDataRowFunc,
  setDeletedDataRowFunc,
} from "./datagridTypes";

export const changeDataRowValue = (
  newValue: any,
  dataField: string,
  dataRow?: DataRow,
  setCreatedDataRow?: setCreatedDataRowFunc,
  setChangedDataRow?: setChangedDataRowFunc,
  changedDataRow?: DataRow,
  createdDataRow?: DataRow
) => {
  if (createdDataRow) {
    createdDataRow = cloneDataRow(createdDataRow);
    (createdDataRow as DataRow)[dataField] = newValue;
    (setCreatedDataRow as setCreatedDataRowFunc)(createdDataRow as DataRow);
  } else if (changedDataRow) {
    changedDataRow = cloneDataRow(changedDataRow);
    (changedDataRow as DataRow)[dataField] = newValue;
    (setChangedDataRow as setChangedDataRowFunc)(changedDataRow as DataRow);
  } else {
    if ((dataRow as DataRow)[dataField] === newValue) {
      return;
    }

    dataRow = cloneDataRow(dataRow);
    (dataRow as DataRow)[dataField] = newValue;
    (setChangedDataRow as setChangedDataRowFunc)(dataRow as DataRow);
  }
};

export const cloneDataRow = (dataRow?: DataRow) => {
  return JSON.parse(JSON.stringify(dataRow));
};

// https://stackoverflow.com/a/52869830
export const isIsoDate = (str: string) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str);
  return d.toISOString() === str;
};

export const isCellChanged = (
  dataField: string,
  changedDataRow?: DataRow,
  originalDataRow?: DataRow,
  isCreatedDataRow?: boolean
) => {
  if (isCreatedDataRow) {
    return true;
  } else if (originalDataRow && changedDataRow) {
    return originalDataRow[dataField] !== changedDataRow[dataField];
  } else {
    return false;
  }
};

export const getDataRowActions = (
  dataRowActions: DataRowAction[],
  isDataGridDeleteable: boolean,
  setDeletedDataRow: setDeletedDataRowFunc,
  isDeleted: boolean,
  createdDataRow?: DataRow
): DataRowAction[] =>
  isDataGridDeleteable
    ? [
        ...dataRowActions,
        {
          actionFunction: (dataRow) =>
            setDeletedDataRow(
              !isDeleted,
              dataRow ?? (createdDataRow as DataRow)
            ),
          icon: isDeleted ? (
            <MdRestoreFromTrash color="green"></MdRestoreFromTrash>
          ) : (
            <MdDelete color="red"></MdDelete>
          ),
          name: isDeleted ? "Restore" : "Delete",
        },
      ]
    : dataRowActions;

export const shouldKeepColumnOnMobile = (
  col: DataGridColumn,
  cols: DataGridColumn[]
) => {
  return col.keepColumnOnMobile || cols.every((col) => !col.keepColumnOnMobile);
};

export const someExpandableColumnExists = (cols: DataGridColumn[]) =>
  cols.some((col) => col.expandableColumn);
