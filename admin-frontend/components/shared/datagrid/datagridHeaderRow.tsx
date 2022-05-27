import { TableHead, TableRow, TableCell, Button } from "@mui/material";
import { FC } from "react";
import { MdSave } from "react-icons/md";
import styled from "styled-components";
import { DataGridColumn } from "./datagrid";

interface DataGridHeaderRowProps {
  onSaveButtonClick?: () => void;
  cols: DataGridColumn[];
  enableSaveButton: boolean;
  isDataGridSaveable: boolean;
}

const DataGridHeaderRow: FC<DataGridHeaderRowProps> = (props) => {
  return (
    <TableHead>
      <TableRow>
        {props.cols.map((col) => (
          <DataGridHeaderCell
            key={`headerCell_${col.dataField}`}
            header={col.header}
          ></DataGridHeaderCell>
        ))}
        {props.isDataGridSaveable && (
          <DataGridSaveButtonHeaderCell
            enableSaveButton={props.enableSaveButton}
            onClick={props.onSaveButtonClick ?? (() => {})}
          />
        )}
      </TableRow>
    </TableHead>
  );
};

interface DataGridHeaderCellProps {
  header: string;
}

const DataGridHeaderCell: FC<DataGridHeaderCellProps> = (props) => {
  return <TableCell>{props.header}</TableCell>;
};

interface DataGridSaveButtonHeaderCellProps {
  onClick: () => void;
  enableSaveButton: boolean;
}

const DataGridSaveButtonHeaderCell: FC<DataGridSaveButtonHeaderCellProps> = (
  props
) => {
  return (
    <TableCell>
      <AddButtonContainer>
        <Button
          color="success"
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
