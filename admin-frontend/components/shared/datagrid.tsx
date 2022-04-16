import {
  Icon,
  IconButton,
  List,
  ListItem,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Popover,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import { MdMoreVert, MdExpandMore, MdExpandLess } from "react-icons/md";
import { IconBaseProps } from "react-icons";
import useMobileLayout from "../../hooks/useMobileLayout";

export interface DataRowAction {
  name: string;
  icon: React.FC<IconBaseProps>;
  action: (dataRow: any) => void;
}

export interface DataGridColumn {
  header: string;
  dataField?: string;
  dataType?: "dateTime" | "currency" | "date" | "string" | "rating" | "email";
  keepOnMobile?: boolean; // Keep this column on a mobile device screen
  componentFunc?: (dataRow: any) => React.ReactElement;
}

export interface DataGridProps {
  data: any[];
  cols: DataGridColumn[];
  caption?: string;
  height?: string;
  width?: string;
  dataRowActions?: DataRowAction[];
  expandRowComponentFunc?: (dataRow: any) => React.ReactElement;
}

const DataGrid: React.FunctionComponent<DataGridProps> = (props) => {
  const ALTERNATE_ROW_COLOR = "#ebebeb";

  const theme = useSelector<RootState, ThemeState>((state) => state.theme);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const [expandedRowIndices, setExpandedRowIndices] = useState<number[]>([]);

  // Remove non-mobile columns on a mobile device
  const onMobileDevice = useMobileLayout();
  const atLeastOneColHasKeepOnMobile = (cols: DataGridColumn[]) => {
    return props.cols.some((col) => col.keepOnMobile);
  };
  const [cols, setCols] = useState<DataGridColumn[]>(props.cols);
  useEffect(() => {
    if (onMobileDevice && atLeastOneColHasKeepOnMobile(props.cols)) {
      setCols(props.cols.filter((col) => col.keepOnMobile));
    } else {
      setCols(props.cols);
    }
  }, [onMobileDevice]);

  const renderDateTimeValue = (dateTime: Date | string | null) => {
    if (!dateTime) {
      return "";
    }

    if (typeof dateTime === "string") {
      dateTime = new Date(dateTime);
    }

    return theme.formatters.dateTimeFormatter(dateTime);
  };

  const renderDateValue = (date: Date | string | null) => {
    if (!date) {
      return "";
    }

    if (typeof date === "string") {
      date = new Date(date);
    }

    return theme.formatters.dateTimeFormatter(date);
  };

  const renderBooleanValue = (bool: boolean | string | null) => {
    return (
      <CheckBox
        color={theme.colors.primaryColor}
        isChecked={typeof bool === "string" ? stringToBool(bool) : bool}
      ></CheckBox>
    );
  };

  const renderEmailValue = (email: string | null) => {
    return (
      <Typography variant="body1">
        <a
          style={{
            color: theme.colors.primaryColor,
            textDecoration: "underline",
          }}
          href={`mailto:${email}`}
        >
          {email}
        </a>
      </Typography>
    );
  };

  return (
    <>
      {props.caption && <Typography variant="h2">{props.caption}</Typography>}
      <StyledTableContainer
        width={props.width}
        height={props.height}
        component={Paper}
      >
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
              {props.expandRowComponentFunc && (
                <TableCell style={{ width: "6rem" }}></TableCell>
              )}
              {props.dataRowActions && (
                <TableCell style={{ width: "6rem" }}></TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((dataRow, i) => (
              <>
                <TableRow
                  onClick={() => {
                    setSelectedRowIndex(i);
                  }}
                  key={`datagrid_row_${i}`}
                >
                  {cols.map((col: DataGridColumn, j) => (
                    <TableCell
                      style={{
                        backgroundColor:
                          selectedRowIndex === i
                            ? `${theme.colors.primaryColor}30`
                            : i % 2 == 1
                            ? ALTERNATE_ROW_COLOR
                            : undefined,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      height="fit-content"
                      key={`datagrid_cell_${i}_${j}`}
                    >
                      {col.componentFunc
                        ? col.componentFunc(dataRow)
                        : !col.dataField
                        ? null
                        : col.dataType === "date"
                        ? renderDateValue(dataRow[col.dataField])
                        : col.dataType === "dateTime"
                        ? renderDateTimeValue(dataRow[col.dataField])
                        : typeof dataRow[col.dataField] === "boolean"
                        ? renderBooleanValue(dataRow[col.dataField])
                        : col.dataType === "email"
                        ? renderEmailValue(dataRow[col.dataField])
                        : dataRow[col.dataField]}
                    </TableCell>
                  ))}
                  {props.expandRowComponentFunc && (
                    <TableCell
                      style={{
                        width: "6rem",
                        backgroundColor:
                          selectedRowIndex === i
                            ? `${theme.colors.primaryColor}30`
                            : i % 2 == 1
                            ? ALTERNATE_ROW_COLOR
                            : undefined,
                      }}
                      key={`datagrid_cell_more_options_row_${i}`}
                    >
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <IconButton>
                          {expandedRowIndices.includes(i) ? (
                            <MdExpandLess
                              onClick={() => {
                                setExpandedRowIndices(
                                  expandedRowIndices.filter(
                                    (expandedRowIndex) => expandedRowIndex !== i
                                  )
                                );
                              }}
                            ></MdExpandLess>
                          ) : (
                            <MdExpandMore
                              onClick={() => {
                                setExpandedRowIndices([
                                  ...expandedRowIndices,
                                  i,
                                ]);
                              }}
                            ></MdExpandMore>
                          )}
                        </IconButton>
                      </div>
                    </TableCell>
                  )}
                  {props.dataRowActions && props.dataRowActions.length === 1 && (
                    <TableCell
                      style={{
                        width: "6rem",
                        backgroundColor:
                          selectedRowIndex === i
                            ? `${theme.colors.primaryColor}30`
                            : i % 2 == 1
                            ? ALTERNATE_ROW_COLOR
                            : undefined,
                      }}
                      key={`datagrid_cell_more_options_row_${i}`}
                    >
                      <div>
                        <Button
                          backgroundColor={theme.colors.primaryColor}
                          variant="contained"
                          onClick={() => {
                            if (props.dataRowActions) {
                              props.dataRowActions[0].action(dataRow);
                            }
                          }}
                        >
                          {props.dataRowActions &&
                            React.createElement(props.dataRowActions[0].icon)}
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  {props.dataRowActions && props.dataRowActions.length > 1 && (
                    <TableCell
                      style={{
                        width: "6rem",
                        backgroundColor:
                          selectedRowIndex === i
                            ? `${theme.colors.primaryColor}30`
                            : i % 2 == 1
                            ? ALTERNATE_ROW_COLOR
                            : undefined,
                      }}
                      key={`datagrid_cell_more_options_row_${i}`}
                    >
                      <PopupState variant="popover">
                        {(popupState) => (
                          <div>
                            <Button
                              backgroundColor={theme.colors.primaryColor}
                              variant="contained"
                              {...bindTrigger(popupState)}
                            >
                              <MdMoreVert></MdMoreVert>
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
                                  props.dataRowActions.map(
                                    (dataRowAction, i) => {
                                      return (
                                        <ListItem
                                          key={`listItem_${i}`}
                                          disablePadding
                                        >
                                          <ListItemButton
                                            onClick={() =>
                                              dataRowAction.action(dataRow)
                                            }
                                          >
                                            <ListItemIcon>
                                              {React.createElement(
                                                dataRowAction.icon
                                              )}
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={dataRowAction.name}
                                            />
                                          </ListItemButton>
                                        </ListItem>
                                      );
                                    }
                                  )}
                              </List>
                            </Popover>
                          </div>
                        )}
                      </PopupState>
                    </TableCell>
                  )}
                </TableRow>
                {expandedRowIndices.includes(i) &&
                  props.expandRowComponentFunc && (
                    <TableRow>
                      <TableCell
                        colSpan={
                          props.cols.length + 1 + (props.dataRowActions ? 1 : 0)
                        }
                      >
                        {props.expandRowComponentFunc(dataRow)}
                      </TableCell>
                    </TableRow>
                  )}
              </>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </>
  );
};

interface StyledTableContainerProps {
  height?: string;
  width?: string;
  component?: any;
}

const StyledTableContainer = styled(Paper)<StyledTableContainerProps>`
  height: ${(props) => props.height ?? "auto"};
  width: ${(props) => props.width ?? "100%"};
`;

export default DataGrid;
