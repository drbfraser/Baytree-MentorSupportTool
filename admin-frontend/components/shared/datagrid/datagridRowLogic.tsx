import { DataRow } from "./datagrid";
import { setChangedDataRowFunc } from "./datagridBodyDataRows";

export const changeDataRowValue = (
  newValue: any,
  dataField: string,
  dataRow: DataRow,
  setChangedDataRow: setChangedDataRowFunc
) => {
  dataRow[dataField] = newValue;
  setChangedDataRow(dataRow);
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
    return originalDataRow[dataField] === changedDataRow[dataField];
  } else {
    return false;
  }
};
