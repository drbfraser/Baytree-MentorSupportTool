import { FC } from "react";
import { DataRow, DataGridColumn } from "./datagrid";

interface DataGridRowProps {
  dataRow: DataRow;
  cols: DataGridColumn[];
}

const DataGridRow: FC<DataGridRowProps> = () => {};

interface DataGridCellProps {}

const DataGridCell: FC<DataGridCellProps> = () => {};

export default DataGridRow;
