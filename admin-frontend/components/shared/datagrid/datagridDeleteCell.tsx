import { TableCell, Button, Tooltip } from "@mui/material";
import { FC } from "react";
import { MdRestoreFromTrash, MdDelete } from "react-icons/md";
import styled from "styled-components";

interface DataRowDeleteCellProps {
  onDeleteRow: (isDeleted: boolean) => void;
  isRowDeleted?: boolean;
}

const DataRowDeleteCell: FC<DataRowDeleteCellProps> = (props) => {
  return (
    <TableCell>
      <DeleteButtonContainer>
        <Tooltip title="Delete Item">
          <Button
            color="error"
            variant="contained"
            onClick={() => props.onDeleteRow(!props.isRowDeleted)}
          >
            {props.isRowDeleted ? (
              <MdRestoreFromTrash size="24"></MdRestoreFromTrash>
            ) : (
              <MdDelete size="24"></MdDelete>
            )}
          </Button>
        </Tooltip>
      </DeleteButtonContainer>
    </TableCell>
  );
};

const DeleteButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

export default DataRowDeleteCell;
