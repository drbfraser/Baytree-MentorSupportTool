import { Button, TableCell, TableRow } from "@mui/material";
import { FC } from "react";
import { MdDelete, MdRestoreFromTrash } from "react-icons/md";
import styled from "styled-components";
import { DataRow, DataGridColumn, DataRowAction } from "./datagrid";
import {
  setChangedDataRowFunc,
  setCreatedDataRowFunc,
  setDeletedDataRowFunc,
} from "./datagridBodyDataRows";
import DataRowCell from "./datagridCell";
import DataRowActionsCell from "./datagridRowActionsCell";
import {
  changeDataRowValue,
  getDataRowActions,
  isCellChanged,
} from "./datagridRowLogic";

const DataGridRow: FC<DataGridRowProps> = (props) => {
  return (
    <TableRow>
      {props.cols.map((col) => (
        <DataRowCell
          key={`pk_${
            (props.dataRow ?? (props.createdDataRow as DataRow))[
              props.primaryKeyDataField
            ]
          }_df_${col.dataField}`}
          isDataGridSaveable={props.isDataGridSaveable}
          dataField={col.dataField}
          primaryKeyVal={
            (props.dataRow ?? (props.createdDataRow as DataRow))[
              props.primaryKeyDataField
            ]
          }
          isSelectCell={col.onLoadValueOptions !== undefined}
          valueOptions={col.valueOptions}
          value={
            props.changedDataRow
              ? props.changedDataRow[col.dataField]
              : (props.dataRow ?? (props.createdDataRow as DataRow))[
                  col.dataField
                ]
          }
          onChangedValue={(newValue: any) =>
            changeDataRowValue(
              newValue,
              col.dataField,
              props.dataRow,
              props.setCreatedDataRow,
              props.setChangedDataRow,
              props.changedDataRow,
              props.createdDataRow
            )
          }
          isCellChanged={isCellChanged(
            col.dataField,
            props.changedDataRow,
            props.originalDataRow,
            props.isCreatedDataGridRow
          )}
          isCellDeleted={!!props.isDataRowDeleted}
          isColumnEditable={!col.disableEditing}
        ></DataRowCell>
      ))}
      {props.isDataGridSaveable &&
      !props.dataRowActions &&
      props.isDataGridDeleteable ? (
        <DataRowDeleteCell
          onDeleteRow={(isDeleted) =>
            props.setDeletedDataRow(
              isDeleted,
              props.dataRow ?? (props.createdDataRow as DataRow)
            )
          }
          isRowDeleted={!!props.isDataRowDeleted}
        ></DataRowDeleteCell>
      ) : props.dataRowActions && props.dataRow && !props.createdDataRow ? (
        <DataRowActionsCell
          dataRow={props.dataRow}
          actions={getDataRowActions(
            props.dataRowActions,
            !!props.isDataGridDeleteable,
            props.setDeletedDataRow,
            !!props.isDataRowDeleted,
            props.createdDataRow
          )}
        ></DataRowActionsCell>
      ) : (
        <TableCell />
      )}
    </TableRow>
  );
};

interface DataGridRowProps {
  dataRow?: DataRow;
  cols: DataGridColumn[];
  originalDataRow?: DataRow;
  changedDataRow?: DataRow;
  createdDataRow?: DataRow;
  isDataRowDeleted?: boolean;
  setCreatedDataRow?: setCreatedDataRowFunc;
  setChangedDataRow?: setChangedDataRowFunc;
  setDeletedDataRow: setDeletedDataRowFunc;
  primaryKeyDataField: string;
  isCreatedDataGridRow?: boolean;
  isDataGridSaveable: boolean;
  dataRowActions?: DataRowAction[];
  isDataGridDeleteable?: boolean;
}

interface DataRowDeleteCellProps {
  onDeleteRow: (isDeleted: boolean) => void;
  isRowDeleted?: boolean;
}

const DataRowDeleteCell: FC<DataRowDeleteCellProps> = (props) => {
  return (
    <TableCell>
      <DeleteButtonContainer>
        <Button
          color="error"
          variant="contained"
          onClick={() => props.onDeleteRow(!props.isRowDeleted)}
        >
          {props.isRowDeleted ? (
            <MdRestoreFromTrash size="24"></MdRestoreFromTrash>
          ) : (
            <MdDelete size="24"></MdDelete>
          )}
        </Button>
      </DeleteButtonContainer>
    </TableCell>
  );
};

const DeleteButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

export default DataGridRow;
