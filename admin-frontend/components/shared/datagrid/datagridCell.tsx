import { MenuItem, Select, TableCell, TextField } from "@mui/material";
import { FC } from "react";
import { ValueOption } from "./datagrid";

interface DataGridCellProps {
  isSelectCell: boolean;
  valueOptions: ValueOption[];
  value: any;
  onChangedValue: (newValue: any) => void;
  isCellChanged: boolean;
  primaryKeyVal: any;
  dataField: string;
}

const DataGridCell: FC<DataGridCellProps> = (props) => {
  return (
    <TableCell>
      {props.isSelectCell ? (
        <Select
          key={`select_datarow_${props.primaryKeyVal}_col_${props.dataField}`}
          fullWidth
          defaultValue={props.value}
          onChange={(event) => props.onChangedValue(event.target.value)}
        >
          {props.valueOptions.map((valueOption, k) => (
            <MenuItem key={valueOption.id} value={valueOption.id}>
              {valueOption.name}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          fullWidth
          defaultValue={props.value}
          onBlur={(event) => props.onChangedValue(event.target.value)}
        ></TextField>
      )}
    </TableCell>
  );
};
