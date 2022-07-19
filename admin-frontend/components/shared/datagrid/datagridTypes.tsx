import { ReactElement } from "react";

export type onLoadDataRowsFunc = (loadOptions: {
  searchText: string;
  dataFieldsToSearch: string[];
}) => Promise<DataRow[]>;

export type onLoadPagedDataRowsFunc = (loadOptions: {
  searchText: string;
  dataFieldsToSearch: string[];
  limit?: number;
  offset?: number;
}) => Promise<PagedDataRows<DataRow>>;

export type DataRow = Record<string, any>;

export type PagedDataRows<DataRowType> = {
  count: number; // total record/object number in db table/model
  results: DataRowType[] /* ex.
    [
      {
          "id": 2,
          "name": "Into School Mentoring",
          "viewsSessionGroupId": 5,
          "activity": 2
      },
      ...
    ]*/;
};

export type onSaveDataRowsFunc<DataRowType> = (
  createdRows: DataRowType[],
  updatedRows: DataRowType[],
  deletedRows: DataRowType[]
) => Promise<boolean>;

export interface DataGridColumn {
  header: string;
  dataField: string;

  // If column is "date" dataType, value format must be a string in "yyyy-mm-dd" (Javascript Date not working for now)
  dataType?: ColumnDataTypes;

  valueOptions?: ValueOption[];
  onLoadValueOptions?: OnLoadColumnValueOptionsFunc;
  isMultiSelect?: boolean;
  disableEditing?: boolean;
  enableSearching?: boolean;
  keepColumnOnMobile?: boolean;
  expandableColumn?: boolean;
  isRequired?: boolean;
}

export type ColumnDataTypes = "date" | "boolean";
// If column is "date" dataType, value format must be a string in "yyyy-mm-dd" (Javascript Date not working for now)

export type OnLoadColumnValueOptionsFunc = () => Promise<ValueOption[]>;

export interface ValueOption {
  id: any;
  name: string;
}

export interface DataRowAction {
  icon: ReactElement;
  name: string;
  actionFunction: (dataRow: DataRow) => void;
}

export type setCreatedDataRowFunc = (createdDataRow: DataRow) => void;
export type setChangedDataRowFunc = (changedDataRow: DataRow) => void;
export type setDeletedDataRowFunc = (
  isDeleted: boolean,
  dataRow: DataRow
) => void;

export interface InvalidCell {
  primaryKey: string;
  dataField: string;
}
