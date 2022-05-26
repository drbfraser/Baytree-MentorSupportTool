import { DataRow } from "./datagrid";
import { setChangedDataRowFunc } from "./datagridBodyDataRows";

export const changeDataRowValue = (
  newValue: any,
  setChangedDataRow: setChangedDataRowFunc
) => {};

export const isCellChanged = (
  changedDataRow?: DataRow,
  originalDataRow?: DataRow,
  isCreatedDataRow?: boolean
) => {
  if (isCreatedDataRow) {
    return true;
  }
};
