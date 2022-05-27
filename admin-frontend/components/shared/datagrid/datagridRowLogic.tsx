import { DataRow } from "./datagrid";
import {
  setChangedDataRowFunc,
  setCreatedDataRowFunc,
} from "./datagridBodyDataRows";

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
    createdDataRow = JSON.parse(JSON.stringify(createdDataRow));
    (createdDataRow as DataRow)[dataField] = newValue;
    (setCreatedDataRow as setCreatedDataRowFunc)(createdDataRow as DataRow);
  } else if (changedDataRow) {
    changedDataRow = JSON.parse(JSON.stringify(changedDataRow));
    (changedDataRow as DataRow)[dataField] = newValue;
    (setChangedDataRow as setChangedDataRowFunc)(changedDataRow as DataRow);
  } else {
    dataRow = JSON.parse(JSON.stringify(dataRow));
    (dataRow as DataRow)[dataField] = newValue;
    (setChangedDataRow as setChangedDataRowFunc)(dataRow as DataRow);
  }
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
