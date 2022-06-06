import { LocalizationProvider, DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { FC, useState } from "react";
import { padLeftString } from "../../../util/misc";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export interface DataGridDateComponentProps {
  primaryKeyVal: any;
  dataField: string;
  onChangedValue: (newValue: any) => void;
  value: any;
}

const DataGridDateComponent: FC<DataGridDateComponentProps> = (props) => {
  const [datePickerValue, setDatePickerValue] = useState<Date | null>(
    props.value
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
  );
};

export default DataGridDateComponent;
