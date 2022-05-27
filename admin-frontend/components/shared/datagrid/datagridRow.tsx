import { Button, TableCell, TableRow } from "@mui/material";
import { FC } from "react";
import { MdDelete, MdRestoreFromTrash } from "react-icons/md";
import styled from "styled-components";
import { DataRow, DataGridColumn } from "./datagrid";
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
          isDataGridSaveable={props.isDataGridSaveable}
          dataField={col.dataField}
          primaryKeyVal={props.dataRow[props.primaryKeyDataField]}
          isSelectCell={col.onLoadValueOptions !== undefined}
          valueOptions={col.valueOptions}
          value={
            props.changedDataRow
              ? props.changedDataRow[col.dataField]
              : props.dataRow[col.dataField]
          }
          onChangedValue={(newValue: any) =>
            changeDataRowValue(
              newValue,
              col.dataField,
              props.dataRow,
              props.setCreatedDataRow ?? props.setChangedDataRow
            )
          }
          isCellChanged={isCellChanged(
            col.dataField,
            props.changedDataRow,
            props.originalDataRow,
            props.isCreatedDataGridRow
          )}
          isCellDeleted={!!props.isDataRowDeleted}
        ></DataGridCell>
      ))}
      {props.isDataGridSaveable && (
        <DataGridDeleteCell
          onDeleteRow={(isDeleted) =>
            props.setDeletedDataRow(isDeleted, props.dataRow)
          }
          isRowDeleted={!!props.isDataRowDeleted}
        ></DataGridDeleteCell>
      )}
    </TableRow>
  );
};

interface DataGridRowProps {
  dataRow: DataRow;
  cols: DataGridColumn[];
  originalDataRow?: DataRow;
  changedDataRow?: DataRow;
  isDataRowDeleted?: boolean;
  setCreatedDataRow?: setCreatedDataRowFunc;
  setChangedDataRow: setChangedDataRowFunc;
  setDeletedDataRow: setDeletedDataRowFunc;
  primaryKeyDataField: string;
  isCreatedDataGridRow?: boolean;
  isDataGridSaveable: boolean;
}

interface DataGridDeleteCellProps {
  onDeleteRow: (isDeleted: boolean) => void;
  isRowDeleted?: boolean;
}

const DataGridDeleteCell: FC<DataGridDeleteCellProps> = (props) => {
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
  justify-content: center;
`;

export default DataGridRow;
