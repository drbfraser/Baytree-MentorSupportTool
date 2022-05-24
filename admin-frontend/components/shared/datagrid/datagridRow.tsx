import { TableRow } from "@mui/material";
import { FC } from "react";
import { DataRow, DataGridColumn } from "./datagrid";
import {
  setChangedDataRowFunc,
  setDeletedDataRowFunc,
} from "./datagridBodyDataRows";

const DataGridRow: FC<DataGridRowProps> = (props) => {
  return (
    <TableRow>
      {props.cols.map((col) => (
        <DataGridCell
          isSelectCell={col.onLoadValueOptions !== undefined}
          valueOptions={col.valueOptions}
          value={props.dataRow[col.dataField]}
          onChangedValue={(newValue: any) =>
            changeDataRowValue(newValue, props.setChangedDataRow)
          }
          isCellChanged={isCellChanged(
            props.changedDataRow,
            props.originalDataRow
          )}
        ></DataGridCell>
      ))}
    </TableRow>
  );
};

interface DataGridRowProps {
  dataRow: DataRow;
  cols: DataGridColumn[];
  originalDataRow: DataRow;
  changedDataRow: DataRow;
  setChangedDataRow: setChangedDataRowFunc;
  setDeletedDataRow: setDeletedDataRowFunc;
}

export default DataGridRow;
