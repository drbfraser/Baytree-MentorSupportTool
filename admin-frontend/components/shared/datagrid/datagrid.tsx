import { FC, useEffect, useRef, useState } from "react";
import { Table, TableRow, TableCell, Button } from "@mui/material";
import DataGridBody from "./datagridBody";
import {
  createDataRow,
  getChangedDataRow,
  getOriginalDataRow,
  isDataRowDeleted,
  loadColumnValueOptions,
  loadDataRows,
  setChangedDataRow,
  setCreatedDataRow,
  setDeletedDataRow,
} from "./datagridLogic";
import { MdAdd } from "react-icons/md";
import DataGridHeaderRow from "./datagridHeaderRow";

const DataGrid: FC<DataGridProps> = (props) => {
  const [isLoadingDataRows, setIsLoadingDataRows] = useState(false);
  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const [cols, setCols] = useState<DataGridColumn[]>(props.cols);
  const originalDataRowsRef = useRef<DataRow[]>([]);
  const [changedDataRows, setChangedDataRows] = useState<DataRow[]>([]);
  const [createdDataRows, setCreatedDataRows] = useState<DataRow[]>([]);
  const [deletedDataRows, setDeletedDataRows] = useState<DataRow[]>([]);
  const createRowNextIdRef = useRef(0);
  const primaryKeyDataFieldRef = useRef(props.primaryKeyDataField ?? "id");

  useEffect(() => {
    const getData = async () => {
      await loadDataRows(props.onLoadDataRows, setDataRows);
    };

    getData();
  }, [props.onLoadDataRows]);

  useEffect(() => loadColumnValueOptions(cols, setCols), [props.cols]);

  return (
    <Table>
      <DataGridHeaderRow
        cols={cols}
        onSaveButtonClick={
          props.onSaveDataRows
            ? () =>
                (props.onSaveDataRows as onSaveDataRowsFunc)(
                  createdDataRows.map((row) => {
                    // Remove primary key value from created rows
                    let createdDataRowsClone = JSON.parse(
                      JSON.stringify(createdDataRows)
                    ) as DataRow[];

                    createdDataRowsClone.forEach(
                      (dataRow) =>
                        delete dataRow[props.primaryKeyDataField as string]
                    );

                    return createdDataRowsClone;
                  }),
                  changedDataRows,
                  deletedDataRows
                )
            : undefined
        }
      ></DataGridHeaderRow>
      <DataGridBody
        isLoadingDataRows={isLoadingDataRows}
        dataRows={dataRows}
        createdDataRows={createdDataRows}
        deletedDataRows={deletedDataRows}
        getOriginalDataRow={(dataRow) =>
          getOriginalDataRow(
            dataRow,
            originalDataRowsRef.current,
            primaryKeyDataFieldRef.current
          )
        }
        getChangedDataRow={(dataRow) =>
          getChangedDataRow(
            dataRow,
            changedDataRows,
            primaryKeyDataFieldRef.current
          )
        }
        isDataRowDeleted={(dataRow) =>
          isDataRowDeleted(
            dataRow,
            deletedDataRows,
            primaryKeyDataFieldRef.current
          )
        }
        setChangedDataRow={(changedDataRow) =>
          setChangedDataRow(
            dataRows,
            changedDataRow,
            originalDataRowsRef,
            changedDataRows,
            setChangedDataRows,
            primaryKeyDataFieldRef.current
          )
        }
        setCreatedDataRow={(createdDataRow) =>
          setCreatedDataRow(
            createdDataRow,
            createdDataRows,
            primaryKeyDataFieldRef.current,
            setCreatedDataRows
          )
        }
        setDeletedDataRow={(isDeleted, dataRow) =>
          setDeletedDataRow(
            isDeleted,
            dataRow,
            deletedDataRows,
            setDeletedDataRows,
            primaryKeyDataFieldRef.current
          )
        }
        onLoadDataRows={props.onLoadDataRows}
        onSaveDataRows={props.onSaveDataRows}
        cols={cols}
        primaryKeyDataField={primaryKeyDataFieldRef.current}
      ></DataGridBody>
      <DataGridAddRow
        numColumns={cols.length}
        onAddRow={() =>
          createDataRow(
            createRowNextIdRef.current++,
            createdDataRows,
            setCreatedDataRows,
            cols,
            primaryKeyDataFieldRef.current
          )
        }
      ></DataGridAddRow>
    </Table>
  );
};

export interface DataGridProps {
  onLoadDataRows: onLoadDataRowsFunc;
  onSaveDataRows?: onSaveDataRowsFunc;
  cols: DataGridColumn[];
  primaryKeyDataField?: string; // default primary key is "id"
}

export type onLoadDataRowsFunc = () => Promise<DataRow[]>;

export type DataRow = Record<string, any>;

export type onSaveDataRowsFunc = (
  createRows: DataRow[],
  updateRows: DataRow[],
  deleteRows: DataRow[]
) => Promise<boolean>;

export interface DataGridColumn {
  header: string;
  dataField: string;

  valueOptions?: ValueOption[];
  onLoadValueOptions?: () => Promise<ValueOption[]>;
}

export interface ValueOption {
  id: number;
  name: string;
}

interface DataGridAddRowProps {
  numColumns: number;
  onAddRow: () => void;
}

const DataGridAddRow: FC<DataGridAddRowProps> = (props) => {
  return (
    <TableRow>
      <TableCell colSpan={props.numColumns + 1}>
        <Button onClick={props.onAddRow} startIcon={<MdAdd />}></Button>
      </TableCell>
    </TableRow>
  );
};

export default DataGrid;
