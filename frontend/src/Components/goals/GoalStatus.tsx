import { Chip } from "@mui/material";
import { FunctionComponent } from "react";
import { Goal } from "../../api/goals";

const GoalStatus: FunctionComponent<{status: Goal["status"]}> = ({status}) => {
  const color = status === "IN PROGRESS" ? "secondary"
    : status === "ACHIEVED" ? "primary" : "warning";

  return <Chip color={color} size="small" label={status} />
}

export default GoalStatus;