import { Select, MenuItem, Checkbox } from "@mui/material";
import { FC, useState } from "react";
import { ValueOption } from "./datagridTypes";

export interface DataGridSelectComponentProps {
  primaryKeyVal: any;
  dataField: string;
  idNumber: number;
  value: any;
  onChangedValue: (newValue: any) => void;
  valueOptions?: ValueOption[];
  isMultiSelect?: boolean;
}

const DataGridSelectComponent: FC<DataGridSelectComponentProps> = (props) => {
  const isMultiSelect = props.isMultiSelect || Array.isArray(props.value);
  const [value, setValue] = useState<any>(props.value ?? "");

  const renderValue = (ids: any) => {
    if (isMultiSelect) {
      return ids.map((id: any) => getOptionName(id)).join(", ");
    } else {
      return getOptionName(ids);
    }
  };

  const getOptionName = (id: any) =>
    props.valueOptions?.find((opt) => opt.id === id)?.name ?? "";

  return (
    <Select
      key={`select_datarow_${props.primaryKeyVal}_col_${props.dataField}_selectRef${props.idNumber}`}
      fullWidth
      multiple={isMultiSelect}
      defaultValue={props.value ?? ""}
      onChange={(event) => {
        const newValue = event.target.value;
        props.onChangedValue(newValue);
        setValue(newValue);
      }}
      renderValue={renderValue}
      sx={{ fontSize: "0.8rem" }}
    >
      {props.valueOptions!.map((valueOption, k) => (
        <MenuItem key={valueOption.id} value={valueOption.id}>
          {isMultiSelect && (
            <Checkbox checked={value.includes(valueOption.id)} />
          )}
          {valueOption.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default DataGridSelectComponent;
