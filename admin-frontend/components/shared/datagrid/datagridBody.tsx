import { FC } from "react";
import {
  DataGridColumn,
  DataRow,
  onLoadDataRowsFunc,
  onSaveDataRowsFunc,
} from "./datagrid";
import DataGridBodyCreatedDataRows from "./datagridBodyCreatedDataRows";
import DataGridBodyDataRows from "./datagridBodyDataRows";
import DataGridLoadingBody from "./datagridLoadingBody";

const DataGridBody: FC<DataGridBodyProps> = (props) => {
  return props.isLoadingDataRows ? (
    <DataGridLoadingBody numCols={props.cols.length}></DataGridLoadingBody>
  ) : (
    <>
      <DataGridBodyDataRows
        primaryKeyDataField={props.primaryKeyDataField}
        cols={props.cols}
        dataRows={props.dataRows}
        getOriginalDataRow={props.getOriginalDataRow}
        getChangedDataRow={props.getChangedDataRow}
        isDataRowDeleted={props.isDataRowDeleted}
        setChangedDataRow={props.setChangedDataRow}
        setDeletedDataRow={props.setDeletedDataRow}
      ></DataGridBodyDataRows>
      <DataGridBodyCreatedDataRows
        primaryKeyDataField={props.primaryKeyDataField}
        cols={props.cols}
        createdDataRows={props.createdDataRows}
        getChangedDataRow={props.getChangedDataRow}
        setChangedDataRow={props.setChangedDataRow}
        setCreatedDataRow={props.setCreatedDataRow}
        setDeletedDataRow={props.setDeletedDataRow}
      ></DataGridBodyCreatedDataRows>
    </>
  );
};

export interface DataGridBodyProps {
  isLoadingDataRows: boolean;
  dataRows: DataRow[];
  createdDataRows: DataRow[];
  deletedDataRows: DataRow[];
  onLoadDataRows: onLoadDataRowsFunc;
  onSaveDataRows?: onSaveDataRowsFunc;
  getOriginalDataRow: (dataRow: DataRow) => DataRow;
  getChangedDataRow: (changedDataRow: DataRow) => DataRow;
  isDataRowDeleted: (dataRow: DataRow) => boolean;
  setCreatedDataRow: (createdDataRow: DataRow) => void;
  setChangedDataRow: (changedDataRow: DataRow) => void;
  setDeletedDataRow: (isDeleted: boolean, dataRow: DataRow) => void;
  cols: DataGridColumn[];
  primaryKeyDataField: string;
}

export default DataGridBody;
