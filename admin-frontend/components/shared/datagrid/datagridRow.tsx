import { TableRow } from "@mui/material";
import { FC } from "react";
import { DataRow, DataGridColumn, ValueOption } from "./datagrid";
import {
  setChangedDataRowFunc,
  setCreatedDataRowFunc,
  setDeletedDataRowFunc,
} from "./datagridBodyDataRows";
import DataGridCell from "./datagridCell";
import { changeDataRowValue, isCellChanged } from "./datagridRowLogic";

const DataGridRow: FC<DataGridRowProps> = (props) => {
  return (
    <TableRow>
      {props.cols.map((col) => (
        <DataGridCell
          key={`pk_${props.dataRow[props.primaryKeyDataField]}_df_${
            col.dataField
          }`}
          dataField={col.dataField}
          primaryKeyVal={props.dataRow[props.primaryKeyDataField]}
          isSelectCell={col.onLoadValueOptions !== undefined}
          valueOptions={col.valueOptions}
          value={props.dataRow[col.dataField]}
          onChangedValue={(newValue: any) =>
            changeDataRowValue(
              newValue,
              props.setCreatedDataRow ?? props.setChangedDataRow
            )
          }
          isCellChanged={isCellChanged(
            props.changedDataRow,
            props.originalDataRow,
            props.isCreatedDataGridRow
          )}
        ></DataGridCell>
      ))}
    </TableRow>
  );
};

interface DataGridRowProps {
  dataRow: DataRow;
  cols: DataGridColumn[];
  originalDataRow?: DataRow;
  changedDataRow: DataRow;
  isDataRowDeleted?: boolean;
  setCreatedDataRow?: setCreatedDataRowFunc;
  setChangedDataRow: setChangedDataRowFunc;
  setDeletedDataRow: setDeletedDataRowFunc;
  primaryKeyDataField: string;
  isCreatedDataGridRow?: boolean;
}

export default DataGridRow;
