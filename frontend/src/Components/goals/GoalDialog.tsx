import { Dialog, DialogProps, DialogTitle } from "@mui/material";
import { FunctionComponent } from "react";
import { Goal } from "../../api/goals";

const GoalDialog: FunctionComponent<{goal?: Goal} & DialogProps> = ({goal, ...props}) => {
  const title = goal ? "Edit goal" : "Create new goal";

  return <Dialog {...props}>
    <DialogTitle>{title}</DialogTitle>
  </Dialog>
}

export default GoalDialog;