import { FC } from "react";
import { DataRow, DataGridColumn } from "./datagrid";
import {
  setChangedDataRowFunc,
  setCreatedDataRowFunc,
  setDeletedDataRowFunc,
} from "./datagridBodyDataRows";
import DataGridRow from "./datagridRow";

const DataGridBodyCreatedDataRows: FC<DataGridBodyCreatedDataRowsProps> = (
  props
) => {
  return (
    <>
      {props.createdDataRows.map((dataRow) => (
        <DataGridRow
          key={dataRow[props.primaryKeyDataField]}
          primaryKeyDataField={props.primaryKeyDataField}
          dataRow={dataRow}
          isCreatedDataGridRow
          createdDataRow={dataRow}
          setCreatedDataRow={props.setCreatedDataRow}
          setChangedDataRow={props.setChangedDataRow}
          setDeletedDataRow={(isDeleted, dataRow) =>
            props.removeCreatedDataRow(dataRow)
          }
          cols={props.cols}
          isDataGridSaveable={true}
          isDataGridDeleteable={true}
        ></DataGridRow>
      ))}
    </>
  );
};

interface DataGridBodyCreatedDataRowsProps {
  primaryKeyDataField: string;
  getChangedDataRow: (dataRow: DataRow) => DataRow | undefined;
  setCreatedDataRow: setCreatedDataRowFunc;
  setChangedDataRow: setChangedDataRowFunc;
  setDeletedDataRow: setDeletedDataRowFunc;
  removeCreatedDataRow: (createdDataRow: DataRow) => void;
  cols: DataGridColumn[];
  createdDataRows: DataRow[];
}

export default DataGridBodyCreatedDataRows;
