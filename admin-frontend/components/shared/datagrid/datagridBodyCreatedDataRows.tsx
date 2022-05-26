import { FC } from "react";
import { DataRow, DataGridColumn } from "./datagrid";
import {
  setChangedDataRowFunc,
  setDeletedDataRowFunc,
} from "./datagridBodyDataRows";
import DataGridRow from "./datagridRow";

const DataGridBodyCreatedDataRows: FC<DataGridBodyCreatedDataRowsProps> = (
  props
) => {
  return (
    <>
      {props.createdDataRows.map((dataRow) => (
        <DataGridRow
          key={dataRow[props.primaryKeyDataField]}
          primaryKeyDataField={props.primaryKeyDataField}
          dataRow={dataRow}
          isCreatedDataGridRow
          changedDataRow={props.getChangedDataRow(dataRow)}
          setChangedDataRow={props.setChangedDataRow}
          setDeletedDataRow={props.setDeletedDataRow}
          cols={props.cols}
        ></DataGridRow>
      ))}
    </>
  );
};

interface DataGridBodyCreatedDataRowsProps {
  primaryKeyDataField: string;
  getChangedDataRow: (dataRow: DataRow) => DataRow;
  setChangedDataRow: setChangedDataRowFunc;
  setDeletedDataRow: setDeletedDataRowFunc;
  cols: DataGridColumn[];
  createdDataRows: DataRow[];
}

export default DataGridBodyCreatedDataRows;
