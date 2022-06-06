import { DatePicker, LocalizationProvider } from "@mui/lab";
import {
  Checkbox,
  MenuItem,
  Select,
  Skeleton,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useRef, useState } from "react";
import styled from "styled-components";
import { ColumnDataTypes, ValueOption } from "./datagridTypes";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { padLeftString } from "../../../util/misc";
import useMobileLayout from "../../../hooks/useMobileLayout";

interface DataRowCellProps {
  isSelectCell: boolean;
  valueOptions?: ValueOption[];
  value: any;
  onChangedValue: (newValue: any) => void;
  isCellChanged: boolean;
  isCellDeleted: boolean;
  primaryKeyVal: any;
  dataField: string;
  dataType?: ColumnDataTypes;
  isDataGridSaveable: boolean;
  isColumnEditable: boolean;
  color?: string;
  useDivInsteadOfTableCell?: boolean;
  isCellInvalid?: boolean;
}

const DataRowCell: FC<DataRowCellProps> = (props) => {
  const selectIdRef = useRef(0);
  const isOnMobileDevice = useMobileLayout();

  // Current DatePicker value for date columns
  const [datePickerValue, setDatePickerValue] = useState<Date | null>(
    props.value && props.dataType === "date"
      ? (() => {
          // Split string date "yyyy-mm-dd" and use to construct Date object
          // to avoid conversion issues from UTC to local time
          const dateSplit = props.value.split("-");
          return new Date(
            dateSplit[0],
            parseInt(dateSplit[1]) - 1,
            dateSplit[2]
          );
        })()
      : null
  );

  const [checkBoxChecked, setCheckBoxChecked] = useState<boolean | null>(
    props.value && props.dataType === "boolean" ? props.value : null
  );

  const renderDataGridCell = () => {
    return (
      <DataGridCellContainer
        justifycontent={isOnMobileDevice ? "flex-start" : "center"}
      >
        {props.isSelectCell && props.isColumnEditable ? (
          !props.valueOptions ? (
            <LoadingDataGridCell></LoadingDataGridCell>
          ) : (
            <Select
              key={`select_datarow_${props.primaryKeyVal}_col_${
                props.dataField
              }_selectRef${selectIdRef.current++}`}
              fullWidth
              defaultValue={props.value ?? ""}
              onChange={(event) => props.onChangedValue(event.target.value)}
              sx={{ fontSize: "0.8rem" }}
            >
              {props.valueOptions.map((valueOption, k) => (
                <MenuItem key={valueOption.id} value={valueOption.id}>
                  {valueOption.name}
                </MenuItem>
              ))}
            </Select>
          )
        ) : props.dataType === "date" &&
          props.isDataGridSaveable &&
          props.isColumnEditable ? (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              disableMaskedInput={true}
              inputFormat="yyyy-MM-dd"
              key={`datepicker_${props.primaryKeyVal}_col_${props.dataField}`}
              views={["year", "month", "day"]}
              openTo="year"
              value={datePickerValue}
              onChange={(newValue) => {
                if (newValue) {
                  // Convert to date string to store in datarow
                  const year = newValue.getFullYear();
                  const month = newValue.getMonth();
                  const day = newValue.getDate();
                  const dateString = `${year}-${padLeftString(
                    "0",
                    2,
                    (month + 1).toString()
                  )}-${padLeftString("0", 2, day.toString())}`;
                  props.onChangedValue(dateString);
                  setDatePickerValue(newValue);
                } else {
                  props.onChangedValue(null);
                  setDatePickerValue(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true,
                    style: { fontSize: "0.8rem" },
                  }}
                />
              )}
            ></DatePicker>
          </LocalizationProvider>
        ) : props.dataType === "boolean" ? (
          <Checkbox
            color="success"
            disabled={!props.isDataGridSaveable || !props.isColumnEditable}
            key={`checkbox_${props.primaryKeyVal}_col_${props.dataField}`}
            checked={!!checkBoxChecked}
            onChange={(event) => {
              setCheckBoxChecked(event.target.checked);
              props.onChangedValue(event.target.checked);
            }}
            size={"large" as any} // Need to supress typescript error
          ></Checkbox>
        ) : props.isDataGridSaveable && props.isColumnEditable ? (
          <TextField
            fullWidth
            defaultValue={props.value}
            onBlur={(event) => props.onChangedValue(event.target.value)}
            inputProps={{
              style: { fontSize: "0.8rem" },
            }}
          ></TextField>
        ) : (
          <Typography
            sx={{
              fontSize: "0.8rem",
              whiteSpace: "nowrap",
              wordBreak: "break-word",
            }}
          >
            {props.value}
          </Typography>
        )}
      </DataGridCellContainer>
    );
  };

  return props.useDivInsteadOfTableCell ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor:
          props.isCellDeleted || props.isCellInvalid
            ? "lightpink"
            : props.isCellChanged
            ? "lightgreen"
            : props.color
            ? props.color
            : "unset",
      }}
    >
      {renderDataGridCell()}
    </div>
  ) : (
    <StyledDataGridCell
      cellbackgroundcolor={
        props.isCellDeleted || props.isCellInvalid
          ? "lightpink"
          : props.isCellChanged
          ? "lightgreen"
          : props.color
          ? props.color
          : "unset"
      }
    >
      {renderDataGridCell()}
    </StyledDataGridCell>
  );
};

const StyledDataGridCell = styled(TableCell)<{ cellbackgroundcolor: string }>`
  background-color: ${(props) => props.cellbackgroundcolor};
`;

const DataGridCellContainer = styled.div<{ justifycontent: string }>`
  display: flex;
  justify-content: ${(props) => props.justifycontent ?? "flex-start"};
`;

const LoadingDataGridCell: FC = () => {
  const NUM_SKELETON_ROWS = 3;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {Array.from(Array(NUM_SKELETON_ROWS).keys()).map((idx) => (
        <Skeleton key={`skeleton_${idx}`}></Skeleton>
      ))}
    </div>
  );
};

export default DataRowCell;
