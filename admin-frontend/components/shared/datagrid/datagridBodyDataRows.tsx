import { FC } from "react";
import { DataRow, DataGridColumn } from "./datagrid";
import DataGridRow from "./datagridRow";

const DataGridBodyDataRows: FC<DataGridBodyDataRowsProps> = (props) => {
  return (
    <>
      {props.dataRows.map((dataRow) => (
        <DataGridRow
          key={dataRow[props.primaryKeyDataField]}
          dataRow={dataRow}
          originalDataRow={props.getOriginalDataRow(dataRow)}
          changedDataRow={props.getChangedDataRow(dataRow)}
          setChangedDataRow={props.setChangedDataRow}
          setDeletedDataRow={props.setDeletedDataRow}
          cols={props.cols}
        ></DataGridRow>
      ))}
    </>
  );
};

interface DataGridBodyDataRowsProps {
  primaryKeyDataField: string;
  getOriginalDataRow: (dataRow: DataRow) => DataRow;
  getChangedDataRow: (dataRow: DataRow) => DataRow;
  setChangedDataRow: setChangedDataRowFunc;
  setDeletedDataRow: setDeletedDataRowFunc;
  cols: DataGridColumn[];
  dataRows: DataRow[];
}

export type setChangedDataRowFunc = (changedDataRow: DataRow) => void;
export type setDeletedDataRowFunc = (
  isDeleted: boolean,
  dataRow: DataRow
) => void;

export default DataGridBodyDataRows;
