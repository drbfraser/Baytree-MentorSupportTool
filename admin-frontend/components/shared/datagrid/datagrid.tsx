import { FC } from "react";
import { Table, TableRow, TableHead, TableCell } from "@mui/material";
import DataGridBody from "./datagridBody";

const DataGrid: FC<DataGridProps> = (props) => {
  return (
    <Table>
      <DataGridHeaderRow cols={props.cols}></DataGridHeaderRow>
      <DataGridBody
        onLoadDataRows={props.onLoadDataRows}
        onSaveDataRows={props.onSaveDataRows}
        cols={props.cols}
        primaryKeyDataField={props.primaryKeyDataField}
      ></DataGridBody>
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
  cols: DataGridColumn[];
}

const DataGridHeaderRow: FC<DataGridHeaderRowProps> = (props) => {
  return (
    <TableHead>
      <TableRow>
        {props.cols.map((col) => (
          <DataGridHeaderCell header={col.header}></DataGridHeaderCell>
        ))}
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

export default DataGrid;
