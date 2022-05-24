import { FC, useRef, useState } from "react";
import {
  DataGridColumn,
  DataRow,
  onLoadDataRowsFunc,
  onSaveDataRowsFunc,
} from "./datagrid";
import DataGridBodyCreatedDataRows from "./datagridBodyCreatedDataRows";
import DataGridBodyDataRows from "./datagridBodyDataRows";
import {
  getChangedDataRow,
  getOriginalDataRow,
  setChangedDataRow,
  setDeletedDataRow,
} from "./datagridBodyLogic";
import DataGridLoadingBody from "./datagridLoadingBody";

const DataGridBody: FC<DataGridBodyProps> = (props) => {
  const [isLoadingDataRows, setIsLoadingDataRows] = useState(false);
  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const originalDataRowsRef = useRef<DataRow[]>([]);
  const [changedDataRows, setChangedDataRows] = useState<DataRow[]>([]);
  const [createdDataRows, setCreatedDataRows] = useState<DataRow[]>([]);
  const [deletedDataRows, setDeletedDataRows] = useState<DataRow[]>([]);

  return isLoadingDataRows ? (
    <DataGridLoadingBody numCols={props.cols.length}></DataGridLoadingBody>
  ) : (
    <>
      <DataGridBodyDataRows
        primaryKeyDataField={props.primaryKeyDataField}
        cols={props.cols}
        dataRows={dataRows}
        getOriginalDataRow={(dataRow) =>
          getOriginalDataRow(
            dataRow,
            originalDataRowsRef.current,
            props.primaryKeyDataField
          )
        }
        getChangedDataRow={(dataRow) =>
          getChangedDataRow(dataRow, changedDataRows, props.primaryKeyDataField)
        }
        setChangedDataRow={(changedDataRow) =>
          setChangedDataRow(
            changedDataRow,
            originalDataRowsRef,
            setChangedDataRows
          )
        }
        setDeletedDataRow={(isDeleted, dataRow) =>
          setDeletedDataRow(
            isDeleted,
            dataRow,
            deletedDataRows,
            setDeletedDataRows
          )
        }
      ></DataGridBodyDataRows>
      <DataGridBodyCreatedDataRows></DataGridBodyCreatedDataRows>
    </>
  );
};

export interface DataGridBodyProps {
  onLoadDataRows: onLoadDataRowsFunc;
  onSaveDataRows?: onSaveDataRowsFunc;
  cols: DataGridColumn[];
  primaryKeyDataField: string;
}

export default DataGridBody;
