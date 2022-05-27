import {
  MenuItem,
  Select,
  Skeleton,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useRef } from "react";
import styled from "styled-components";
import { ValueOption } from "./datagrid";

const DataGridCell: FC<DataGridCellProps> = (props) => {
  const selectIdRef = useRef(0);

  return (
    <StyledDataGridCell
      cellBackgroundColor={
        props.isCellDeleted
          ? "lightpink"
          : props.isCellChanged
          ? "lightgreen"
          : "unset"
      }
    >
      {props.isSelectCell ? (
        !props.valueOptions ? (
          <LoadingDataGridCell></LoadingDataGridCell>
        ) : (
          <Select
            key={`select_datarow_${props.primaryKeyVal}_col_${
              props.dataField
            }_selectRef${selectIdRef.current++}`}
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
        )
      ) : props.isDataGridSaveable ? (
        <TextField
          fullWidth
          defaultValue={props.value}
          onBlur={(event) => props.onChangedValue(event.target.value)}
        ></TextField>
      ) : (
        <Typography>{props.value}</Typography>
      )}
    </StyledDataGridCell>
  );
};

interface DataGridCellProps {
  isSelectCell: boolean;
  valueOptions?: ValueOption[];
  value: any;
  onChangedValue: (newValue: any) => void;
  isCellChanged: boolean;
  isCellDeleted: boolean;
  primaryKeyVal: any;
  dataField: string;
  isDataGridSaveable: boolean;
}

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
