import { FC, useRef, useState } from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  Button,
  IconButton,
} from "@mui/material";
import DataGridBody from "./datagridBody";
import {
  createDataRow,
  getChangedDataRow,
  getOriginalDataRow,
  isDataRowDeleted,
  setChangedDataRow,
  setCreatedDataRow,
  setDeletedDataRow,
} from "./datagridLogic";
import { MdAdd } from "react-icons/md";

const DataGrid: FC<DataGridProps> = (props) => {
  const [isLoadingDataRows, setIsLoadingDataRows] = useState(false);
  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const originalDataRowsRef = useRef<DataRow[]>([]);
  const [changedDataRows, setChangedDataRows] = useState<DataRow[]>([]);
  const [createdDataRows, setCreatedDataRows] = useState<DataRow[]>([]);
  const [deletedDataRows, setDeletedDataRows] = useState<DataRow[]>([]);
  const createRowNextIdRef = useRef(0);

  return (
    <Table>
      <DataGridHeaderRow
        cols={props.cols}
        onSaveButtonClick={
          props.onSaveDataRows
            ? () =>
                (props.onSaveDataRows as onSaveDataRowsFunc)(
                  createdDataRows,
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
            props.primaryKeyDataField
          )
        }
        getChangedDataRow={(dataRow) =>
          getChangedDataRow(dataRow, changedDataRows, props.primaryKeyDataField)
        }
        isDataRowDeleted={(dataRow) =>
          isDataRowDeleted(dataRow, deletedDataRows, props.primaryKeyDataField)
        }
        setChangedDataRow={(changedDataRow) =>
          setChangedDataRow(
            dataRows,
            changedDataRow,
            originalDataRowsRef,
            changedDataRows,
            setChangedDataRows,
            props.primaryKeyDataField
          )
        }
        setCreatedDataRow={(createdDataRow) =>
          setCreatedDataRow(
            createdDataRow,
            createdDataRows,
            props.primaryKeyDataField,
            setCreatedDataRows
          )
        }
        setDeletedDataRow={(isDeleted, dataRow) =>
          setDeletedDataRow(
            isDeleted,
            dataRow,
            deletedDataRows,
            setDeletedDataRows,
            props.primaryKeyDataField
          )
        }
        onLoadDataRows={props.onLoadDataRows}
        onSaveDataRows={props.onSaveDataRows}
        cols={props.cols}
        primaryKeyDataField={props.primaryKeyDataField}
      ></DataGridBody>
      <DataGridAddRow
        numColumns={props.cols.length}
        onAddRow={() =>
          createDataRow(
            createRowNextIdRef.current++,
            createdDataRows,
            setCreatedDataRows,
            props.cols,
            props.primaryKeyDataField
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
  primaryKeyDataField: string;
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

interface DataGridHeaderRowProps {
  onSaveButtonClick?: () => void;
  cols: DataGridColumn[];
}

const DataGridHeaderRow: FC<DataGridHeaderRowProps> = (props) => {
  return (
    <TableHead>
      <TableRow>
        {props.cols.map((col) => (
          <DataGridHeaderCell
            key={`headerCell_${col.dataField}`}
            header={col.header}
          ></DataGridHeaderCell>
        ))}
        {props.onSaveButtonClick && (
          <DataGridSaveButtonHeaderCell onClick={props.onSaveButtonClick} />
        )}
      </TableRow>
    </TableHead>
  );
};

interface DataGridHeaderCellProps {
  header: string;
}

const DataGridHeaderCell: FC<DataGridHeaderCellProps> = (props) => {
  return <TableCell>{props.header}</TableCell>;
};

interface DataGridSaveButtonHeaderCellProps {
  onClick: () => void;
}

const DataGridSaveButtonHeaderCell: FC<DataGridSaveButtonHeaderCellProps> = (
  props
) => {
  return (
    <TableCell>
      <Button onClick={props.onClick}></Button>
    </TableCell>
  );
};

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
