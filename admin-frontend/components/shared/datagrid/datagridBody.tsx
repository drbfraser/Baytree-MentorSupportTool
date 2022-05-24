import { FC, useState } from "react";
import { DataGridColumn, DataRow } from "./datagrid";
import DataGridLoadingBody from "./datagridLoadingBody";
import DataGridRow from "./datagridRow";

const DataGridBody: FC<DataGridBodyProps> = (props) => {
  const [isLoadingDataRows, setIsLoadingDataRows] = useState(false);
  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const [originalDataRows, setOriginalDataRows] = useState<DataRow[]>([]);
  const [changedDataRows, setChangedDataRows] = useState<DataRow[]>([]);
  const [createdDataRows, setCreatedDataRows] = useState<DataRow[]>([]);
  const [deletedDataRows, setDeletedDataRows] = useState<DataRow[]>([]);

  return isLoadingDataRows ? (
    <DataGridLoadingBody numCols={props.cols.length}></DataGridLoadingBody>
  ) : (
    dataRows.map((dataRow) => (
      <DataGridRow
        key={dataRow[props.primaryKeyDataField]}
        dataRow={dataRow}
        cols={props.cols}
      ></DataGridRow>
    ))
  );
};

export interface DataGridBodyProps {
  onLoadDataRows: () => Promise<DataRow[]>;
  onSaveDataRows?: (
    createRows: DataRow[],
    updateRows: DataRow[],
    deleteRows: DataRow[]
  ) => Promise<boolean>;
  cols: DataGridColumn[];
  primaryKeyDataField: string;
}

export default DataGridBody;
