import { TableHead, TableRow, TableCell, Button } from "@mui/material";
import { FC } from "react";
import { MdSave } from "react-icons/md";
import styled from "styled-components";
import useMobileLayout from "../../../hooks/useMobileLayout";
import { someExpandableColumnExists } from "./datagridRowLogic";
import { DataGridColumn } from "./datagridTypes";

interface DataGridHeaderRowProps {
  onSaveButtonClick?: () => void;
  cols: DataGridColumn[];
  enableSaveButton: boolean;
  isDataGridSaveable: boolean;
  hasDataRowActions: boolean;
}

const DataGridHeaderRow: FC<DataGridHeaderRowProps> = (props) => {
  const isOnMobileDevice = useMobileLayout();
  const SAVE_BUTTON_CELL_WIDTH_PERCENT = isOnMobileDevice ? 30 : 10;

  return (
    <TableHead>
      <TableRow>
        {props.cols.map(
          (col) =>
            ((someExpandableColumnExists(props.cols) && col.expandableColumn) ||
              (props.cols.some((col) => col.keepColumnOnMobile) &&
                col.keepColumnOnMobile) ||
              (!someExpandableColumnExists(props.cols) &&
                !props.cols.some((col) => col.keepColumnOnMobile)) ||
              (!isOnMobileDevice &&
                !someExpandableColumnExists(props.cols))) && (
              <TableCell
                key={`headerCell_${col.dataField}`}
                sx={{
                  textAlign: isOnMobileDevice ? "left" : "center",
                  width: `${
                    (100 - SAVE_BUTTON_CELL_WIDTH_PERCENT) /
                    (!someExpandableColumnExists(props.cols) && isOnMobileDevice
                      ? props.cols.filter((col) => col.keepColumnOnMobile)
                          .length
                      : someExpandableColumnExists(props.cols)
                      ? props.cols.filter((col) => col.expandableColumn).length
                      : props.cols.length)
                  }%`,
                }}
              >
                {col.header}
              </TableCell>
            )
        )}
        {props.isDataGridSaveable ? (
          <DataGridSaveButtonHeaderCell
            width={`${SAVE_BUTTON_CELL_WIDTH_PERCENT}%`}
            enableSaveButton={props.enableSaveButton}
            onClick={props.onSaveButtonClick ?? (() => {})}
          />
        ) : props.hasDataRowActions ? (
          <TableCell
            sx={{ width: `${SAVE_BUTTON_CELL_WIDTH_PERCENT}%` }}
          ></TableCell>
        ) : null}
      </TableRow>
    </TableHead>
  );
};

interface DataGridSaveButtonHeaderCellProps {
  onClick: () => void;
  enableSaveButton: boolean;
  width: string;
}

const DataGridSaveButtonHeaderCell: FC<DataGridSaveButtonHeaderCellProps> = (
  props
) => {
  return (
    <TableCell sx={{ width: props.width }}>
      <AddButtonContainer>
        <Button
          color="primary"
          variant="contained"
          disabled={!props.enableSaveButton}
          onClick={props.onClick}
        >
          <MdSave size="24"></MdSave>
        </Button>
      </AddButtonContainer>
    </TableCell>
  );
};

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

export default DataGridHeaderRow;
