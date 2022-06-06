import { Select, MenuItem } from "@mui/material";
import { FC } from "react";
import { ValueOption } from "./datagridTypes";

export interface DataGridSelectComponentProps {
  primaryKeyVal: any;
  dataField: string;
  idNumber: number;
  value: any;
  onChangedValue: (newValue: any) => void;
  valueOptions?: ValueOption[];
}

const DataGridSelectComponent: FC<DataGridSelectComponentProps> = (props) => {
  return (
    <Select
      key={`select_datarow_${props.primaryKeyVal}_col_${props.dataField}_selectRef${props.idNumber}`}
      fullWidth
      defaultValue={props.value ?? ""}
      onChange={(event) => props.onChangedValue(event.target.value)}
      sx={{ fontSize: "0.8rem" }}
    >
      {props.valueOptions!.map((valueOption, k) => (
        <MenuItem key={valueOption.id} value={valueOption.id}>
          {valueOption.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default DataGridSelectComponent;
