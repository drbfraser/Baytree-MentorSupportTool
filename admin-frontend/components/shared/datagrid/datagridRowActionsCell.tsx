import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  TableCell,
  Tooltip,
} from "@mui/material";
import { FC, useRef, useState } from "react";
import { MdMoreVert } from "react-icons/md";
import styled from "styled-components";
import { DataRow, DataRowAction } from "./datagrid";

const DataRowActionsCell: FC<DataRowActionsCellProps> = (props) => {
  const [isActionsPopoverOpened, setIsActionsPopoverOpened] = useState(false);
  const actionButtonRef = useRef(null);

  return (
    <TableCell>
      <ActionButtonContainer>
        {props.actions.length === 1 ? (
          <Tooltip title={props.actions[0].name}>
            <Button
              color="success"
              ref={actionButtonRef}
              variant="contained"
              onClick={() => props.actions[0].actionFunction(props.dataRow)}
            >
              {props.actions[0].icon}
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="More Actions">
            <Button
              color="success"
              ref={actionButtonRef}
              variant="contained"
              onClick={() => setIsActionsPopoverOpened(true)}
            >
              <MdMoreVert size="24"></MdMoreVert>
            </Button>
          </Tooltip>
        )}
        {props.actions.length > 1 && (
          <Popover
            open={isActionsPopoverOpened}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            onClose={() => setIsActionsPopoverOpened(false)}
            anchorEl={actionButtonRef.current}
          >
            <List>
              {props.actions.map((action) => (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setIsActionsPopoverOpened(false);
                      action.actionFunction(props.dataRow);
                    }}
                  >
                    <ListItemIcon>{action.icon}</ListItemIcon>
                    <ListItemText primary={action.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Popover>
        )}
      </ActionButtonContainer>
    </TableCell>
  );
};

interface DataRowActionsCellProps {
  actions: DataRowAction[];
  dataRow: DataRow;
}

const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

export default DataRowActionsCell;
