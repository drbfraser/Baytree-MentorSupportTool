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
          key={`pk_${props.dataRow[props.primaryKeyDataField]}_df_${
            col.dataField
          }`}
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
  primaryKeyDataField: string;
}

export default DataGridRow;
