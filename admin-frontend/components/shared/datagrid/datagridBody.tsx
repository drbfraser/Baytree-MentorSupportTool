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
        getOriginalDataRow={(dataRow) => props.getOriginalDataRow(dataRow)}
        getChangedDataRow={(dataRow) => props.getChangedDataRow(dataRow)}
        isDataRowDeleted={props.isDataRowDeleted}
        setChangedDataRow={(changedDataRow) =>
          props.setChangedDataRow(changedDataRow)
        }
        setDeletedDataRow={(isDeleted, dataRow) =>
          props.setDeletedDataRow(isDeleted, dataRow)
        }
      ></DataGridBodyDataRows>
      <DataGridBodyCreatedDataRows
        primaryKeyDataField={props.primaryKeyDataField}
        cols={props.cols}
        createdDataRows={props.createdDataRows}
        getChangedDataRow={(dataRow) => props.getChangedDataRow(dataRow)}
        setChangedDataRow={(changedDataRow) =>
          props.setChangedDataRow(changedDataRow)
        }
        setDeletedDataRow={(isDeleted, dataRow) =>
          props.setDeletedDataRow(isDeleted, dataRow)
        }
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
  setChangedDataRow: (dataRow: DataRow) => void;
  setDeletedDataRow: (isDeleted: boolean, dataRow: DataRow) => void;
  cols: DataGridColumn[];
  primaryKeyDataField: string;
}

export default DataGridBody;
