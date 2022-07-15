import { Chip, TableCell, TableRow } from "@mui/material";
import { addMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { FunctionComponent } from "react";
import { SessionRecord } from "../../api/records";
import { TIMEZONE_ID } from "../../Utils/locale";

const RecordRow: FunctionComponent<{ session: SessionRecord, handleClick: () => void }> = ({ session, handleClick }) => {
  const [startH, startM] = session.startTime.split(":").map(m => +m);
  const startTime = addMinutes(new Date(session.startDate), startH * 60 + startM);

  return <TableRow hover onClick={handleClick}>
    <TableCell>{session.name}</TableCell>
    <TableCell>{formatInTimeZone(startTime, TIMEZONE_ID, "do MMMM Y")}</TableCell>
    <TableCell>{formatInTimeZone(startTime, TIMEZONE_ID, "hh:mm aa")}</TableCell>
    <TableCell>{session.duration}</TableCell>
    <TableCell align="center">
      {+session.cancelled !== 0
        ? <Chip label="CANCELLED" size="small" color="error" />
        : <Chip label="ATTENDED" size="small" color="success" />}
    </TableCell>
  </TableRow>
}

export default RecordRow;