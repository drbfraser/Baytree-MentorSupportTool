import {
  MenuItem,
  Select,
  Skeleton,
  TableCell,
  TextField,
} from "@mui/material";
import { FC } from "react";
import styled from "styled-components";
import { ValueOption } from "./datagrid";

interface DataGridCellProps {
  isSelectCell: boolean;
  valueOptions?: ValueOption[];
  value: any;
  onChangedValue: (newValue: any) => void;
  isCellChanged: boolean;
  primaryKeyVal: any;
  dataField: string;
}

const DataGridCell: FC<DataGridCellProps> = (props) => {
  return (
    <StyledDataGridCell
      cellBackgroundColor={props.isCellChanged ? "lightgreen" : "unset"}
    >
      {props.isSelectCell ? (
        <Select
          key={`select_datarow_${props.primaryKeyVal}_col_${props.dataField}`}
          fullWidth
          defaultValue={props.value}
          onChange={(event) => props.onChangedValue(event.target.value)}
        >
          {!props.valueOptions ? (
            <LoadingDataGridCell></LoadingDataGridCell>
          ) : (
            props.valueOptions.map((valueOption, k) => (
              <MenuItem key={valueOption.id} value={valueOption.id}>
                {valueOption.name}
              </MenuItem>
            ))
          )}
        </Select>
      ) : (
        <TextField
          fullWidth
          defaultValue={props.value}
          onBlur={(event) => props.onChangedValue(event.target.value)}
        ></TextField>
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
        <Skeleton></Skeleton>
      ))}
    </>
  );
};

export default DataGridCell;
