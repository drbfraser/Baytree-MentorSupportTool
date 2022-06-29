import { Chip, TableCell, TableRow } from "@mui/material";
import { addMinutes, format } from "date-fns";
import { FunctionComponent } from "react";
import { SessionRecord } from "../../api/records";

const RecordRow: FunctionComponent<{ session: SessionRecord, handleClick: () => void }> = ({ session, handleClick }) => {
  const [startH, startM] = session.startTime.split(":").map(m => +m);
  const startTime = addMinutes(new Date(session.startDate), startH * 60 + startM);

  return <TableRow hover onClick={handleClick}>
    <TableCell>{session.name}</TableCell>
    <TableCell>{format(startTime, "d MMM Y")}</TableCell>
    <TableCell>{format(startTime, "hh:mm aa")}</TableCell>
    <TableCell>{session.duration}</TableCell>
    <TableCell align="center">
      {+session.cancelled !== 0
        ? <Chip label="CANCELLED" size="small" color="error" />
        : <Chip label="ATTENDED" size="small" color="success" />}
    </TableCell>
  </TableRow>
}

export default RecordRow;