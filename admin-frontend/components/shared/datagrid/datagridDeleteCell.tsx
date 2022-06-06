import { TableCell, Button, Tooltip } from "@mui/material";
import { FC } from "react";
import { MdRestoreFromTrash, MdDelete } from "react-icons/md";
import styled from "styled-components";
import useMobileLayout from "../../../hooks/useMobileLayout";

interface DataRowDeleteCellProps {
  onDeleteRow: (isDeleted: boolean) => void;
  isRowDeleted?: boolean;
  useDivInsteadOfTableCell?: boolean;
}

const DataRowDeleteCell: FC<DataRowDeleteCellProps> = (props) => {
  const isOnMobileDevice = useMobileLayout();

  const renderDeleteCell = () => {
    return (
      <DeleteButtonContainer
        justifycontent={isOnMobileDevice ? "flex-start" : "flex-end"}
      >
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
    );
  };

  return props.useDivInsteadOfTableCell ? (
    <div>{renderDeleteCell()}</div>
  ) : (
    <TableCell>{renderDeleteCell()}</TableCell>
  );
};

const DeleteButtonContainer = styled.div<{ justifycontent: string }>`
  display: flex;
  justify-content: ${(props) => props.justifycontent ?? "flex-end"};
`;

export default DataRowDeleteCell;
