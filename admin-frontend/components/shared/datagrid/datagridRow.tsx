import { Divider, TableCell, TableRow, Typography } from "@mui/material";
import { FC, Fragment, useState } from "react";
import useMobileLayout from "../../../hooks/useMobileLayout";
import DataRowCell from "./datagridCell";
import DataRowDeleteCell from "./datagridDeleteCell";
import ExpandButtonCell from "./datagridExpandButton";
import DataRowActionsCell from "./datagridRowActionsCell";
import {
  changeDataRowValue,
  checkCellInvalid,
  getDataRowActions,
  isCellChanged,
  shouldKeepColumnOnMobile,
  someExpandableColumnExists,
} from "./datagridRowLogic";
import {
  DataRow,
  DataGridColumn,
  DataRowAction,
  setChangedDataRowFunc,
  setCreatedDataRowFunc,
  setDeletedDataRowFunc,
  InvalidCell,
} from "./datagridTypes";

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
  invalidCells: InvalidCell[];
}

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
                dataType={col.dataType}
                primaryKeyVal={
                  (props.dataRow ?? (props.createdDataRow as DataRow))[
                    props.primaryKeyDataField
                  ]
                }
                isSelectCell={col.onLoadValueOptions !== undefined}
                isMultiSelect={col.isMultiSelect}
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
                isCellInvalid={checkCellInvalid(
                  props.primaryKeyDataField,
                  props.invalidCells,
                  col,
                  props.dataRow,
                  props.changedDataRow,
                  props.createdDataRow
                )}
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
            primaryKeyDataField={props.primaryKeyDataField}
          ></DataRowActionsCell>
        ) : someExpandableColumnExists(props.cols) ||
          (isOnMobileDevice &&
            props.cols.some((col) => col.keepColumnOnMobile)) ? (
          <ExpandButtonCell
            backgroundColor={HEADER_ROW_COLOR}
            setIsRowExpanded={setIsRowExpanded}
            isRowExpanded={isRowExpanded}
          ></ExpandButtonCell>
        ) : props.isDataGridSaveable ? (
          <TableCell />
        ) : null}
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
                    <Fragment
                      key={`Fragment${
                        props.dataRow![props.primaryKeyDataField]
                      }_col_${col.dataField}`}
                    >
                      <ColHeader
                        key={`colheader_${
                          (props.dataRow ?? (props.createdDataRow as DataRow))[
                            props.primaryKeyDataField
                          ]
                        }_df_${col.dataField}`}
                        header={col.header}
                      ></ColHeader>
                      <DataRowCell
                        key={`pk_${
                          (props.dataRow ?? (props.createdDataRow as DataRow))[
                            props.primaryKeyDataField
                          ]
                        }_df_${col.dataField}`}
                        useDivInsteadOfTableCell={true}
                        isDataGridSaveable={props.isDataGridSaveable}
                        dataField={col.dataField}
                        dataType={col.dataType}
                        primaryKeyVal={
                          (props.dataRow ?? (props.createdDataRow as DataRow))[
                            props.primaryKeyDataField
                          ]
                        }
                        isSelectCell={col.onLoadValueOptions !== undefined}
                        isMultiSelect={col.isMultiSelect}
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
                        isCellInvalid={checkCellInvalid(
                          props.primaryKeyDataField,
                          props.invalidCells,
                          col,
                          props.dataRow,
                          props.changedDataRow,
                          props.createdDataRow
                        )}
                      ></DataRowCell>
                      <Divider sx={{ margin: "0.5rem 0" }} />
                    </Fragment>
                  )
              )}
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
                  useDivInsteadOfTableCell={true}
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
                  primaryKeyDataField={props.primaryKeyDataField}
                ></DataRowActionsCell>
              ) : null}
            </TableCell>
          </TableRow>
        )}
    </>
  );
};

const ColHeader: FC<ColHeaderProps> = (props) => {
  const isOnMobileDevice = useMobileLayout();

  return (
    <div
      style={{
        marginTop: "0.5rem",
        display: "flex",
        justifyContent: isOnMobileDevice ? "left" : "center",
      }}
    >
      <Typography sx={{ fontSize: "0.8rem" }}>{props.header}</Typography>
    </div>
  );
};

interface ColHeaderProps {
  header: string;
}

export default DataGridRow;
