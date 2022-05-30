import { FC } from "react";
import DataGridRow from "./datagridRow";
import {
  DataRow,
  DataGridColumn,
  setChangedDataRowFunc,
  setCreatedDataRowFunc,
  setDeletedDataRowFunc,
} from "./datagridTypes";

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
          setDeletedDataRow={(isDeleted: boolean, dataRow: DataRow) =>
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

export default DataGridBodyCreatedDataRows;
