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
import { ValueOption } from "./datagridTypes";

interface DataRowCellProps {
  isSelectCell: boolean;
  valueOptions?: ValueOption[];
  value: any;
  onChangedValue: (newValue: any) => void;
  isCellChanged: boolean;
  isCellDeleted: boolean;
  primaryKeyVal: any;
  dataField: string;
  isDataGridSaveable: boolean;
  isColumnEditable: boolean;
  color?: string;
}

const DataRowCell: FC<DataRowCellProps> = (props) => {
  const selectIdRef = useRef(0);

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
      ) : props.isDataGridSaveable && props.isColumnEditable ? (
        <TextField
          fullWidth
          defaultValue={props.value}
          onBlur={(event) => props.onChangedValue(event.target.value)}
        ></TextField>
      ) : (
        <Typography sx={{ whiteSpace: "nowrap", wordBreak: "break-word" }}>
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

export default DataRowCell;
