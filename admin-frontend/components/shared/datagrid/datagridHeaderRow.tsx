import { TableHead, TableRow, TableCell, Button } from "@mui/material";
import { FC } from "react";
import { MdSave } from "react-icons/md";
import { DataGridColumn } from "./datagrid";

interface DataGridHeaderRowProps {
  onSaveButtonClick?: () => void;
  cols: DataGridColumn[];
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
        {props.onSaveButtonClick && (
          <DataGridSaveButtonHeaderCell onClick={props.onSaveButtonClick} />
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
}

const DataGridSaveButtonHeaderCell: FC<DataGridSaveButtonHeaderCellProps> = (
  props
) => {
  return (
    <TableCell>
      <Button onClick={props.onClick}>
        <MdSave></MdSave>
      </Button>
    </TableCell>
  );
};

export default DataGridHeaderRow;
