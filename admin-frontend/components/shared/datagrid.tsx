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
  SelectChangeEvent,
} from "@mui/material";
import Button from "./button";
import CheckBox from "./checkBox";
import { Table } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
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
  onLoadSelectOptions?: () => Promise<SelectOption[]>;
  onSelectOptionChanged?: (newOption: SelectOption) => void;
}

export interface SelectOption {
  name: string;
  id: number;
}

export interface DataGridProps {
  data?: Record<string, any>[];
  onLoadData?: () => Promise<Record<string, any>[]>;
  cols: DataGridColumn[];
  caption?: string;
  height?: string;
  width?: string;
  dataRowActions?: DataRowAction[];

  primaryKey?: string; // necessary for editable/savable datagrids
  onSaveRows?: onSaveRowsFunc; // resolve/reject
}

export type onSaveRowsFunc = (
  dataRow: Record<string, any>[]
) => Promise<boolean>;

const DataGrid: React.FunctionComponent<DataGridProps> = (props) => {
  const BUTTON_ICON_SIZE = 22;
  const DEFAULT_PRIMARY_KEY = "id";

  const theme = useSelector<RootState, ThemeState>((state) => state.theme);

  // Used for storing and displaying changes to datagrid rows
  const [changedDataRows, setChangedDataRows] = useState<Record<string, any>[]>(
    []
  );
  const [originalRows, setOriginalRows] = useState<Record<string, any>[]>([]);
  const primaryKey = props.primaryKey ?? DEFAULT_PRIMARY_KEY;
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

  useEffect(loadSelectOptions, [props.cols]);

  const [data, setData] = useState<Record<string, any>[]>(props.data ?? []);

  // Update data on props data update
  useEffect(() => {
    if (props.data) {
      setData(props.data);
    }
  }, [props.data]);

  const [isLoadingData, setIsLoadingData] = useState(false);

  const loadData = () => {
    if (props.onLoadData) {
      setIsLoadingData(true);
      props
        .onLoadData()
        .then((dataRows) => {
          setData(dataRows);
        })
        .catch(() => {
          toast.error(
            "Failed to load data. Try refreshing the page with a stable internet connection."
          );
        })
        .finally(() => {
          setIsLoadingData(false);
        });
    }
  };

  useEffect(loadData, [props.onLoadData]);

  const acceptAndSaveChanges = () => {
    setIsSavingChanges(true);

    const dataRowsWithOnlyChangedFields = changedDataRows
      .map((changedDataRow) => {
        const changedDataRowCopy = JSON.parse(JSON.stringify(changedDataRow));
        for (const dataField in changedDataRow) {
          if (dataField === primaryKey) {
            continue;
          }

          if (
            !data.some(
              (dataRow) =>
                dataRow[primaryKey] === changedDataRow[primaryKey] &&
                dataRow[dataField] !== changedDataRow[dataField]
            )
          ) {
            delete changedDataRowCopy[dataField];
          }
        }

        return changedDataRowCopy;
      })
      .filter((dataRow) => dataRow);

    (props.onSaveRows as onSaveRowsFunc)(dataRowsWithOnlyChangedFields)
      .then((savedSuccessfully) => {
        if (savedSuccessfully) {
          // Change local data rows to avoid requesting network data again
          changedDataRows.forEach((changedDataRow) => {
            const dataRowIdx = data.findIndex(
              (dataRow) => dataRow[primaryKey] === changedDataRow[primaryKey]
            );

            if (dataRowIdx !== -1) {
              data[dataRowIdx] = changedDataRow;
            }
          });
          setData(data);

          setOriginalRows([]);
          setChangedDataRows([]);
          setIsSavingChanges(false);
          setIsPreviewingChanges(false);
          toast.success("Successfully saved changes!");
        } else {
          setIsSavingChanges(false);
          toast.error(
            "Failed to save changes. Ensure that there are no duplicate values for a unique column and try again."
          );
        }
      })
      .catch(() => {
        setIsSavingChanges(false);
        toast.error(
          "Failed to save changes. Ensure that there are no duplicate values for a unique column and try again."
        );
      });
  };

  return (
    <>
      {props.caption && <Typography variant="h2">{props.caption}</Typography>}
      <StyledTableContainer
        width={props.width}
        height={props.height}
        component={Paper}
      >
        <OverlaySpinner
          active={isSavingChanges || isLoadingData}
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
                          onClick={acceptAndSaveChanges}
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
              dataRows={isPreviewingChanges ? changedDataRows : data}
              theme={theme}
              originalRows={originalRows}
              setOriginalRows={setOriginalRows}
              buttonIconSize={BUTTON_ICON_SIZE}
              changedDataRows={changedDataRows}
              setChangedDataRows={setChangedDataRows}
              cols={cols}
              primaryKey={primaryKey}
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
  cols: DataGridColumn[];
  primaryKey: string;
  originalRows: Record<string, any>[];
  setOriginalRows: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
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
    col: DataGridColumn
  ) => {
    const originalRow = props.originalRows.find(
      (row) => row[props.primaryKey] === dataRow[props.primaryKey]
    );
    const changedDataRow = props.changedDataRows.find(
      (changedDataRow) =>
        changedDataRow[props.primaryKey] === dataRow[props.primaryKey]
    );

    return (
      originalRow &&
      changedDataRow &&
      originalRow[col.dataField] !== changedDataRow[col.dataField]
    );
  };

  const curSelectKeyRef = useRef(0);

  const getSelectDefaultValue = (
    dataRow: Record<string, any>,
    col: DataGridColumn
  ) => {
    const changedDataRow = props.changedDataRows.find(
      (changedDataRow) =>
        changedDataRow[props.primaryKey] === dataRow[props.primaryKey]
    );

    return changedDataRow
      ? changedDataRow[col.dataField]
      : dataRow[col.dataField] ?? "";
  };

  const onChangeSelectValue = (
    event: SelectChangeEvent<any>,
    dataRow: Record<string, any>,
    col: DataGridColumn
  ) => {
    const primaryKey = props.primaryKey;

    const originalDataRow = props.originalRows.find(
      (originalRow) => originalRow[primaryKey] === dataRow[primaryKey]
    );

    const newSelectValue = event.target.value;
    if (originalDataRow) {
      let changedDataRowIdx = props.changedDataRows.findIndex(
        (changedDataRow) => changedDataRow[primaryKey] === dataRow[primaryKey]
      );

      const changedDataRow = props.changedDataRows[changedDataRowIdx];
      changedDataRow[col.dataField] = newSelectValue;

      if (
        Object.entries(originalDataRow).every(
          (entry) => entry[1] === changedDataRow[entry[0]]
        )
      ) {
        const removeChangedDataRow = props.changedDataRows.filter(
          (changedDataRow) =>
            changedDataRow[primaryKey] !== originalDataRow[primaryKey]
        );
        const removeOriginalDataRow = props.originalRows.filter(
          (originalRow) =>
            originalRow[primaryKey] !== originalDataRow[primaryKey]
        );

        props.setOriginalRows(removeOriginalDataRow);
        props.setChangedDataRows(removeChangedDataRow);
      } else {
        changedDataRow[col.dataField] = newSelectValue;

        props.setChangedDataRows([...props.changedDataRows]);
      }
    } else {
      const changedDataRow = JSON.parse(JSON.stringify(dataRow));
      changedDataRow[col.dataField] = newSelectValue;

      props.setOriginalRows([...props.originalRows, dataRow]);
      props.setChangedDataRows([...props.changedDataRows, changedDataRow]);
    }
  };

  return (
    <>
      {props.dataRows.map((dataRow, i) => (
        <TableRow key={`datagrid_row_${i}`}>
          {props.cols.map((col: DataGridColumn, j) => (
            <TableCell
              style={{
                backgroundColor: hasCellBeenChanged(dataRow, col)
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
                  key={`select_datarow_${
                    dataRow[props.primaryKey]
                  }_col_${curSelectKeyRef.current++}`}
                  fullWidth
                  defaultValue={getSelectDefaultValue(dataRow, col)}
                  onChange={(event) => {
                    onChangeSelectValue(event, dataRow, col);
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
