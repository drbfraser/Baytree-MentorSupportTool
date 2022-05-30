import {
  Button,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  MdDelete,
  MdExpandLess,
  MdExpandMore,
  MdRestoreFromTrash,
} from "react-icons/md";
import styled from "styled-components";
import useMobileLayout from "../../../hooks/useMobileLayout";
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
  shouldKeepColumnOnMobile,
  someExpandableColumnExists,
} from "./datagridRowLogic";

const DataGridRow: FC<DataGridRowProps> = (props) => {
  const [isRowExpanded, setIsRowExpanded] = useState(false);
  const isOnMobileDevice = useMobileLayout();
  const HEADER_ROW_COLOR = "#f8f8f8";

  return (
    <>
      <TableRow>
        {props.cols.map(
          (col) =>
            ((!someExpandableColumnExists(props.cols) && !isOnMobileDevice) ||
              (someExpandableColumnExists(props.cols) &&
                col.expandableColumn) ||
              (!someExpandableColumnExists(props.cols) &&
                shouldKeepColumnOnMobile(col, props.cols))) && (
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
                color={
                  (isOnMobileDevice &&
                    props.cols.some((col) => col.keepColumnOnMobile)) ||
                  (someExpandableColumnExists(props.cols) &&
                    col.expandableColumn)
                    ? HEADER_ROW_COLOR
                    : undefined
                }
              ></DataRowCell>
            )
        )}
        {props.isDataGridSaveable &&
        !props.dataRowActions &&
        props.isDataGridDeleteable &&
        !someExpandableColumnExists(props.cols) &&
        (props.cols.every((col) => col.keepColumnOnMobile === undefined) ||
          props.cols.every((col) => col.keepColumnOnMobile) ||
          !isOnMobileDevice) ? (
          <DataRowDeleteCell
            onDeleteRow={(isDeleted) =>
              props.setDeletedDataRow(
                isDeleted,
                props.dataRow ?? (props.createdDataRow as DataRow)
              )
            }
            isRowDeleted={!!props.isDataRowDeleted}
          ></DataRowDeleteCell>
        ) : props.dataRowActions &&
          props.dataRow &&
          !props.createdDataRow &&
          !someExpandableColumnExists(props.cols) &&
          (props.cols.every((col) => col.keepColumnOnMobile === undefined) ||
            props.cols.every((col) => col.keepColumnOnMobile) ||
            !isOnMobileDevice) ? (
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
        ) : someExpandableColumnExists(props.cols) ||
          (isOnMobileDevice &&
            props.cols.some((col) => col.keepColumnOnMobile)) ? (
          <ExpandButtonCell
            backgroundColor={HEADER_ROW_COLOR}
            setIsRowExpanded={setIsRowExpanded}
            isRowExpanded={isRowExpanded}
          ></ExpandButtonCell>
        ) : (
          <TableCell />
        )}
      </TableRow>
      {isRowExpanded &&
        (isOnMobileDevice || someExpandableColumnExists(props.cols)) && (
          <TableRow>
            <TableCell colSpan={props.cols.length}>
              {props.cols.map(
                (col) =>
                  ((!someExpandableColumnExists(props.cols) &&
                    !col.keepColumnOnMobile) ||
                    (someExpandableColumnExists(props.cols) &&
                      !col.expandableColumn)) && (
                    <>
                      <ColHeader header={col.header}></ColHeader>
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
                            : (props.dataRow ??
                                (props.createdDataRow as DataRow))[
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
                    </>
                  )
              )}
              <div></div>
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
              ) : props.dataRowActions &&
                props.dataRow &&
                !props.createdDataRow ? (
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
              ) : null}
            </TableCell>
          </TableRow>
        )}
    </>
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
        <Tooltip title="Delete Item">
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
        </Tooltip>
      </DeleteButtonContainer>
    </TableCell>
  );
};

const DeleteButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const ColHeader: FC<ColHeaderProps> = (props) => {
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <Typography>{props.header}</Typography>
    </div>
  );
};

interface ColHeaderProps {
  header: string;
}

const ExpandButtonCell: FC<ExpandButtonCellProps> = (props) => {
  return (
    <TableCell sx={{ backgroundColor: props.backgroundColor }}>
      <ExpandButtonContainer color={props.backgroundColor}>
        <Tooltip title={props.isRowExpanded ? "Less Info" : "More Info"}>
          <Button
            color="inherit"
            variant="contained"
            onClick={() => props.setIsRowExpanded(!props.isRowExpanded)}
          >
            {props.isRowExpanded ? (
              <MdExpandLess size="24"></MdExpandLess>
            ) : (
              <MdExpandMore size="24"></MdExpandMore>
            )}
          </Button>
        </Tooltip>
      </ExpandButtonContainer>
    </TableCell>
  );
};

interface ExpandButtonCellProps {
  backgroundColor: string;
  setIsRowExpanded: Dispatch<SetStateAction<boolean>>;
  isRowExpanded: boolean;
}

const ExpandButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default DataGridRow;
