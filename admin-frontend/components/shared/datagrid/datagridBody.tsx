import { FC } from "react";
import DataGridBodyCreatedDataRows from "./datagridBodyCreatedDataRows";
import DataGridBodyDataRows from "./datagridBodyDataRows";
import DataGridLoadingBody from "./datagridLoadingBody";
import {
  DataGridColumn,
  DataRow,
  DataRowAction,
  onLoadDataRowsFunc,
  onLoadPagedDataRowsFunc,
  onSaveDataRowsFunc,
} from "./datagridTypes";

export interface DataGridBodyProps {
  isLoadingDataRows: boolean;
  dataRows: DataRow[];
  createdDataRows: DataRow[];
  deletedDataRows: DataRow[];
  onLoadDataRows: onLoadDataRowsFunc | onLoadPagedDataRowsFunc;
  onSaveDataRows?: onSaveDataRowsFunc;
  getOriginalDataRow: (dataRow: DataRow) => DataRow;
  getChangedDataRow: (changedDataRow: DataRow) => DataRow | undefined;
  isDataRowDeleted: (dataRow: DataRow) => boolean;
  setCreatedDataRow: (createdDataRow: DataRow) => void;
  setChangedDataRow: (changedDataRow: DataRow) => void;
  setDeletedDataRow: (isDeleted: boolean, dataRow: DataRow) => void;
  removeCreatedDataRow: (createdRow: DataRow) => void;
  cols: DataGridColumn[];
  primaryKeyDataField: string;
  dataRowActions?: DataRowAction[];
  isDataGridDeleteable?: boolean;
  pageSize?: number;
}

const DataGridBody: FC<DataGridBodyProps> = (props) => {
  return props.isLoadingDataRows ? (
    <DataGridLoadingBody
      numCols={
        props.onSaveDataRows || props.dataRowActions
          ? props.cols.length + 1
          : props.cols.length
      }
      numLoadingRows={props.pageSize}
    ></DataGridLoadingBody>
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
        isDataGridSaveable={!!props.onSaveDataRows}
        dataRowActions={props.dataRowActions}
        isDataGridDeleteable={props.isDataGridDeleteable}
      ></DataGridBodyDataRows>
      <DataGridBodyCreatedDataRows
        primaryKeyDataField={props.primaryKeyDataField}
        cols={props.cols}
        createdDataRows={props.createdDataRows}
        getChangedDataRow={props.getChangedDataRow}
        setChangedDataRow={props.setChangedDataRow}
        setCreatedDataRow={props.setCreatedDataRow}
        setDeletedDataRow={props.setDeletedDataRow}
        removeCreatedDataRow={props.removeCreatedDataRow}
      ></DataGridBodyCreatedDataRows>
    </>
  );
};

export default DataGridBody;
