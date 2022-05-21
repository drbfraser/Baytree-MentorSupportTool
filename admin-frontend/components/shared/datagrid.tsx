import {
  List,
  ListItem,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Popover,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import Button from "./button";
import CheckBox from "./checkBox";
import { Table } from "@mui/material";
import React, { useEffect, useState } from "react";
import { stringToBool } from "../../util/misc";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import { ThemeState } from "../../reducers/theme";
import styled from "styled-components";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { MdCheck, MdMoreVert, MdOutlineClose, MdSave } from "react-icons/md";
import { IconBaseProps } from "react-icons";
import useMobileLayout from "../../hooks/useMobileLayout";
import { green, red } from "@mui/material/colors";
import OverlaySpinner from "./overlaySpinner";
import { toast } from "react-toastify";

export interface DataRowAction {
  name: string;
  icon: React.FC<IconBaseProps>;
  action: (dataRow: any) => void;
}

export interface DataGridColumn {
  header: string;
  dataField: string;
  dataType?: "dateTime" | "currency" | "date" | "string" | "rating" | "email";
  keepOnMobile?: boolean; // Keep this column on a mobile device screen
  componentFunc?: (dataRow: any) => React.ReactElement;
  selectOptions?: SelectOption[];
  onLoadSelectOptions?: () => Promise<SelectOption[] | undefined>;
  onSelectOptionChanged?: (newOption: SelectOption) => void;
}

export interface SelectOption {
  name: string;
  id: number;
}

export interface DataGridProps {
  data: any[];
  cols: DataGridColumn[];
  caption?: string;
  height?: string;
  width?: string;
  dataRowActions?: DataRowAction[];

  primaryKey?: string; // necessary for editable/savable datagrids
  onSaveRows?: onSaveRowsFunc; // resolve/reject
}

type onSaveRowsFunc = (dataRow: Record<string, any>[]) => Promise<void>;

const DataGrid: React.FunctionComponent<DataGridProps> = (props) => {
  const BUTTON_ICON_SIZE = 22;

  const theme = useSelector<RootState, ThemeState>((state) => state.theme);

  // Used for storing and displaying changes to datagrid rows
  const [changedCellIndices, setChangedCellIndices] = useState<number[][]>([]);
  const [changedDataRows, setChangedDataRows] = useState<Record<string, any>[]>(
    []
  );
  const [isPreviewingChanges, setIsPreviewingChanges] = useState(false);

  const [isSavingChanges, setIsSavingChanges] = useState(false);

  // Remove non-mobile columns on a mobile device
  const onMobileDevice = useMobileLayout();
  const atLeastOneColHasKeepOnMobile = (cols: DataGridColumn[]) => {
    return props.cols.some((col) => col.keepOnMobile);
  };
  const [cols, setCols] = useState<DataGridColumn[]>(props.cols);
  // Updates columns based on current mobile layout and current props.cols
  const updateColumns = () => {
    if (onMobileDevice && atLeastOneColHasKeepOnMobile(props.cols)) {
      setCols(props.cols.filter((col) => col.keepOnMobile));
    } else {
      setCols(props.cols);
    }
  };

  // Update cols if device screen width changes to mobile
  useEffect(updateColumns, [onMobileDevice]);

  // Update cols state if props.cols changes
  useEffect(updateColumns, [props.cols]);

  const loadSelectOptions = () => {
    // Find async select columns
    const selectCols = cols.filter((col) => col.onLoadSelectOptions);

    const loadCallbackFuncs = selectCols.map(
      (selectCol) =>
        (selectCol as any).onLoadSelectOptions() as Promise<
          SelectOption[] | undefined
        >
    ); // Get async cbs

    Promise.all(loadCallbackFuncs)
      .then((selectOptionArrays) => {
        selectOptionArrays.forEach((selectOptions, i) => {
          const col = cols.find(
            (col) => col.dataField === selectCols[i].dataField
          );
          if (col) {
            col.selectOptions = selectOptions;
          }
        });
        setCols(cols);
      })
      .catch(() => {
        toast.error(
          "Failed to load select box options! Please refresh the page and ensure a stable internet connection."
        );
      });
  };

  useEffect(loadSelectOptions, []);

  return (
    <>
      {props.caption && <Typography variant="h2">{props.caption}</Typography>}
      <StyledTableContainer
        width={props.width}
        height={props.height}
        component={Paper}
      >
        <OverlaySpinner
          active={isSavingChanges}
          coverRelativeParentComponent={true}
        ></OverlaySpinner>
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              {cols.map((col, i) => (
                <TableCell
                  style={{ fontWeight: "bold", overflow: "hidden" }}
                  key={`datagrid_headercell_${i}`}
                >
                  {col.header}
                </TableCell>
              ))}
              {(props.dataRowActions || props.onSaveRows) && (
                <TableCell style={{ width: "6rem" }}>
                  {props.onSaveRows &&
                    (!isPreviewingChanges ? (
                      <Button
                        backgroundColor={theme.colors.primaryColor}
                        variant="contained"
                        onClick={() => {
                          setIsPreviewingChanges(true);
                        }}
                        disabled={changedDataRows.length === 0}
                      >
                        <MdSave size={BUTTON_ICON_SIZE}></MdSave>
                      </Button>
                    ) : (
                      <>
                        <Button
                          style={{ marginBottom: "1rem" }}
                          backgroundColor={red[500]}
                          variant="contained"
                          onClick={() => {
                            setIsPreviewingChanges(false);
                          }}
                          disabled={isSavingChanges}
                        >
                          <MdOutlineClose
                            size={BUTTON_ICON_SIZE}
                          ></MdOutlineClose>
                        </Button>
                        <Button
                          backgroundColor={green[500]}
                          variant="contained"
                          onClick={() => {
                            setIsSavingChanges(true);
                            (props.onSaveRows as onSaveRowsFunc)(
                              changedDataRows
                            )
                              .then(() => {
                                setChangedDataRows([]);
                                setChangedCellIndices([]);
                                setIsSavingChanges(false);
                                setIsPreviewingChanges(false);
                                toast.success("Successfully saved changes!");
                              })
                              .catch(() => {
                                setIsSavingChanges(false);
                                toast.error(
                                  "Failed to save changes. Please try again."
                                );
                              });
                          }}
                          disabled={isSavingChanges}
                        >
                          <MdCheck size={BUTTON_ICON_SIZE}></MdCheck>
                        </Button>
                      </>
                    ))}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRows
              dataRows={isPreviewingChanges ? changedDataRows : props.data}
              theme={theme}
              changedCellIndices={changedCellIndices}
              setChangedCellIndices={setChangedCellIndices}
              buttonIconSize={BUTTON_ICON_SIZE}
              changedDataRows={changedDataRows}
              setChangedDataRows={setChangedDataRows}
              cols={cols}
              primaryKey={props.primaryKey}
              dataRowActions={props.dataRowActions}
            ></TableRows>
          </TableBody>
        </Table>
      </StyledTableContainer>
    </>
  );
};

interface TableRowsProps {
  dataRows: Record<string, any>[];
  theme: ThemeState;
  changedCellIndices: number[][];
  setChangedCellIndices: React.Dispatch<React.SetStateAction<number[][]>>;
  cols: DataGridColumn[];
  primaryKey?: string;
  changedDataRows: Record<string, any>[];
  setChangedDataRows: React.Dispatch<
    React.SetStateAction<Record<string, any>[]>
  >;
  dataRowActions?: DataRowAction[];
  buttonIconSize: number;
}

const TableRows: React.FC<TableRowsProps> = (props) => {
  const renderDateTimeValue = (dateTime: Date | string | null) => {
    if (!dateTime) {
      return "";
    }

    if (typeof dateTime === "string") {
      dateTime = new Date(dateTime);
    }

    return props.theme.formatters.dateTimeFormatter(dateTime);
  };

  const renderDateValue = (date: Date | string | null) => {
    if (!date) {
      return "";
    }

    if (typeof date === "string") {
      date = new Date(date);
    }

    return props.theme.formatters.dateTimeFormatter(date);
  };

  const renderBooleanValue = (bool: boolean | string | null) => {
    return (
      <CheckBox
        color={props.theme.colors.primaryColor}
        isChecked={typeof bool === "string" ? stringToBool(bool) : bool}
      ></CheckBox>
    );
  };

  const renderEmailValue = (email: string | null) => {
    return (
      <a
        style={{
          color: props.theme.colors.primaryColor,
          textDecoration: "underline",
        }}
        href={`mailto:${email}`}
      >
        {email}
      </a>
    );
  };

  const hasCellBeenChanged = (
    dataRow: Record<string, any>,
    colIndex: number
  ) => {
    return props.changedCellIndices.some(
      (changedCellIndex) =>
        changedCellIndex[0] === dataRow[props.primaryKey as string] &&
        changedCellIndex[1] === colIndex
    );
  };

  return (
    <>
      {props.dataRows.map((dataRow, i) => (
        <TableRow key={`datagrid_row_${i}`}>
          {props.cols.map((col: DataGridColumn, j) => (
            <TableCell
              style={{
                backgroundColor: hasCellBeenChanged(dataRow, j)
                  ? `${props.theme.colors.primaryColor}30`
                  : undefined,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              height="fit-content"
              key={`datagrid_cell_${i}_${j}`}
            >
              {col.selectOptions ? (
                <Select
                  fullWidth
                  defaultValue={dataRow[col.dataField]}
                  onChange={(event) => {
                    const primaryKey = props.primaryKey as string;

                    if (!hasCellBeenChanged(dataRow, j)) {
                      props.setChangedCellIndices([
                        ...props.changedCellIndices,
                        [dataRow[primaryKey], j],
                      ]);
                    }

                    let changedDataRowIdx = props.changedDataRows.findIndex(
                      (changedDataRow) =>
                        changedDataRow[primaryKey] === dataRow[primaryKey]
                    );

                    dataRow[col.dataField] = event.target.value;
                    if (changedDataRowIdx !== -1) {
                      props.changedDataRows[changedDataRowIdx] = dataRow;
                      props.setChangedDataRows(props.changedDataRows);
                    } else {
                      props.setChangedDataRows([
                        ...props.changedDataRows,
                        dataRow,
                      ]);
                    }
                  }}
                >
                  {col.selectOptions.map((selectOption, k) => (
                    <MenuItem key={selectOption.id} value={selectOption.id}>
                      {selectOption.name}
                    </MenuItem>
                  ))}
                </Select>
              ) : col.onLoadSelectOptions ? (
                <>
                  <Skeleton animation="wave" />
                  <Skeleton animation="wave" />
                  <Skeleton animation="wave" />
                </>
              ) : col.componentFunc ? (
                col.componentFunc(dataRow)
              ) : !col.dataField ? null : col.dataType === "date" ? (
                renderDateValue(dataRow[col.dataField])
              ) : col.dataType === "dateTime" ? (
                renderDateTimeValue(dataRow[col.dataField])
              ) : typeof dataRow[col.dataField] === "boolean" ? (
                renderBooleanValue(dataRow[col.dataField])
              ) : col.dataType === "email" ? (
                renderEmailValue(dataRow[col.dataField])
              ) : (
                dataRow[col.dataField]
              )}
            </TableCell>
          ))}
          {props.dataRowActions && props.dataRowActions.length === 1 && (
            <TableCell width="6rem" key={`datagrid_cell_more_options_row_${i}`}>
              <div>
                <Button
                  backgroundColor={props.theme.colors.primaryColor}
                  variant="contained"
                  onClick={() => {
                    if (props.dataRowActions) {
                      props.dataRowActions[0].action(dataRow);
                    }
                  }}
                >
                  {props.dataRowActions &&
                    React.createElement(props.dataRowActions[0].icon, {
                      size: props.buttonIconSize,
                    })}
                </Button>
              </div>
            </TableCell>
          )}
          {props.dataRowActions && props.dataRowActions.length > 1 && (
            <TableCell
              style={{ width: "3rem" }}
              key={`datagrid_cell_more_options_row_${i}`}
            >
              <PopupState variant="popover">
                {(popupState) => (
                  <div>
                    <Button
                      backgroundColor={props.theme.colors.primaryColor}
                      variant="contained"
                      {...bindTrigger(popupState)}
                    >
                      <MdMoreVert size={props.buttonIconSize}></MdMoreVert>
                    </Button>
                    <Popover
                      {...bindPopover(popupState)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <List>
                        {props.dataRowActions &&
                          props.dataRowActions.map((dataRowAction, i) => {
                            return (
                              <ListItem key={`listItem_${i}`} disablePadding>
                                <ListItemButton
                                  onClick={() => dataRowAction.action(dataRow)}
                                >
                                  <ListItemIcon>
                                    {React.createElement(dataRowAction.icon)}
                                  </ListItemIcon>
                                  <ListItemText primary={dataRowAction.name} />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                      </List>
                    </Popover>
                  </div>
                )}
              </PopupState>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
};

interface StyledTableContainerProps {
  height?: string;
  width?: string;
  component?: any;
}

const StyledTableContainer = styled(Table)<StyledTableContainerProps>`
  height: ${(props) => props.height ?? "auto"};
  width: ${(props) => props.width ?? "100%"};
  position: relative;
`;

export default DataGrid;
