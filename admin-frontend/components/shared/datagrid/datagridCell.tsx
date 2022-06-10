import { Skeleton, TableCell, TextField, Typography } from "@mui/material";
import { FC, useRef } from "react";
import styled from "styled-components";
import { ColumnDataTypes, ValueOption } from "./datagridTypes";
import useMobileLayout from "../../../hooks/useMobileLayout";
import {
  isLoadingSelectOptions,
  shouldRenderBoolComponent,
  shouldRenderDateComponent,
  shouldRenderSelectComponent,
  shouldRenderTextInputComponent,
} from "./datagridCellLogic";
import DataGridSelectComponent from "./datagridSelectComponent";
import DataGridDateComponent from "./datagridDateComponent";
import DataGridBoolComponent from "./datagridBoolComponent";

interface DataRowCellProps {
  isSelectCell: boolean;
  isMultiSelect?: boolean;
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

  /** Renders the correct component for the current column dataType, edit options */
  const renderComponentInCell = () => {
    if (
      shouldRenderSelectComponent(props.isSelectCell, props.isColumnEditable)
    ) {
      if (isLoadingSelectOptions(props.valueOptions)) {
        return <LoadingDataGridCell></LoadingDataGridCell>;
      } else {
        return (
          <DataGridSelectComponent
            primaryKeyVal={props.primaryKeyVal}
            dataField={props.dataField}
            idNumber={selectIdRef.current++}
            value={props.value}
            onChangedValue={props.onChangedValue}
            valueOptions={props.valueOptions}
            isMultiSelect={props.isMultiSelect}
          />
        );
      }
    } else if (
      shouldRenderDateComponent(
        props.dataType,
        props.isDataGridSaveable,
        props.isColumnEditable
      )
    ) {
      return (
        <DataGridDateComponent
          dataField={props.dataField}
          onChangedValue={props.onChangedValue}
          primaryKeyVal={props.primaryKeyVal}
          value={props.value}
        ></DataGridDateComponent>
      );
    } else if (shouldRenderBoolComponent(props.dataType)) {
      return (
        <DataGridBoolComponent
          dataField={props.dataField}
          onChangedValue={props.onChangedValue}
          isColumnEditable={props.isColumnEditable}
          isDataGridSaveable={props.isDataGridSaveable}
          primaryKeyVal={props.primaryKeyVal}
          value={props.value}
        ></DataGridBoolComponent>
      );
    } else if (
      shouldRenderTextInputComponent(
        props.isDataGridSaveable,
        props.isColumnEditable
      )
    ) {
      return (
        <TextField
          fullWidth
          defaultValue={props.value}
          onBlur={(event) => props.onChangedValue(event.target.value)}
          inputProps={{
            style: { fontSize: "0.8rem" },
          }}
        ></TextField>
      );
    } else {
      // Render read-only text component
      return (
        <Typography
          sx={{
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
            wordBreak: "break-word",
          }}
        >
          {props.value}
        </Typography>
      );
    }
  };

  const renderDataGridCell = () => {
    return (
      <DataGridCellContainer
        justifycontent={isOnMobileDevice ? "flex-start" : "center"}
      >
        {renderComponentInCell()}
      </DataGridCellContainer>
    );
  };

  // Use a div to suppress DOM errors on mobile layout
  return props.useDivInsteadOfTableCell ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: props.isCellInvalid
          ? "lightyellow"
          : props.isCellDeleted
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
        props.isCellInvalid
          ? "lightyellow"
          : props.isCellDeleted
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
