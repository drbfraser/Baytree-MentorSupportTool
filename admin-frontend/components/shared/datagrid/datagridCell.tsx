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
}

const DataRowCell: FC<DataRowCellProps> = (props) => {
  const selectIdRef = useRef(0);

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

  return (
    <StyledDataGridCell
      cellBackgroundColor={
        props.isCellDeleted
          ? "lightpink"
          : props.isCellChanged
          ? "lightgreen"
          : props.color
          ? props.color
          : "unset"
      }
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
                }}
              />
            )}
          ></DatePicker>
        </LocalizationProvider>
      ) : props.dataType === "boolean" &&
        props.isDataGridSaveable &&
        props.isColumnEditable ? (
        <CheckboxContainer>
          <Checkbox
            key={`checkbox_${props.primaryKeyVal}_col_${props.dataField}`}
            // Need ternary operator to suppress MUI defaultValue changed error
            defaultChecked={props.isCellChanged ? !props.value : props.value}
            onChange={(event) => props.onChangedValue(event.target.checked)}
            size={"large" as any} // Need to supress typescript error
          ></Checkbox>
        </CheckboxContainer>
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
    </StyledDataGridCell>
  );
};

const StyledDataGridCell = styled(TableCell)<{ cellBackgroundColor: string }>`
  background-color: ${(props) => props.cellBackgroundColor};
`;

const LoadingDataGridCell: FC = () => {
  const NUM_SKELETON_ROWS = 3;

  return (
    <>
      {Array.from(Array(NUM_SKELETON_ROWS).keys()).map((idx) => (
        <Skeleton key={`skeleton_${idx}`}></Skeleton>
      ))}
    </>
  );
};

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default DataRowCell;
