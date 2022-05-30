import { FC } from "react";
import DataGridRow from "./datagridRow";
import {
  DataRow,
  DataGridColumn,
  DataRowAction,
  setChangedDataRowFunc,
  setDeletedDataRowFunc,
} from "./datagridTypes";

interface DataGridBodyDataRowsProps {
  primaryKeyDataField: string;
  getOriginalDataRow: (dataRow: DataRow) => DataRow | undefined;
  getChangedDataRow: (dataRow: DataRow) => DataRow | undefined;
  isDataRowDeleted: (dataRow: DataRow) => boolean;
  setChangedDataRow: setChangedDataRowFunc;
  setDeletedDataRow: setDeletedDataRowFunc;
  cols: DataGridColumn[];
  dataRows: DataRow[];
  isDataGridSaveable: boolean;
  dataRowActions?: DataRowAction[];
  isDataGridDeleteable?: boolean;
}

const DataGridBodyDataRows: FC<DataGridBodyDataRowsProps> = (props) => {
  return (
    <>
      {props.dataRows.map((dataRow) => (
        <DataGridRow
          key={dataRow[props.primaryKeyDataField]}
          primaryKeyDataField={props.primaryKeyDataField}
          dataRow={dataRow}
          originalDataRow={props.getOriginalDataRow(dataRow)}
          changedDataRow={props.getChangedDataRow(dataRow)}
          isDataRowDeleted={props.isDataRowDeleted(dataRow)}
          setChangedDataRow={props.setChangedDataRow}
          setDeletedDataRow={props.setDeletedDataRow}
          cols={props.cols}
          isDataGridSaveable={props.isDataGridSaveable}
          dataRowActions={props.dataRowActions}
          isDataGridDeleteable={props.isDataGridDeleteable}
        ></DataGridRow>
      ))}
    </>
  );
};

export default DataGridBodyDataRows;
