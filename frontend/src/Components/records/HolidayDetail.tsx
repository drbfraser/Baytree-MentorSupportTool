import {
  Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, Typography
} from "@mui/material";
import { formatInTimeZone } from "date-fns-tz";
import { FunctionComponent } from "react";
import { Holiday } from "../../api/misc";
import { TIMEZONE_ID } from "../../Utils/locale";
import InfoTextField from "../shared/InfoTextField";

type Props = {
  holiday?: Holiday | undefined;
  handleClose: () => void;
} & DialogProps;

const HolidayDetail: FunctionComponent<Props> = ({ holiday, handleClose, ...props }) => {
  const renderHoliday = (holiday: Holiday) => {
    const formatDate = (date: string) => {
      return formatInTimeZone(new Date(date), TIMEZONE_ID, "d MMM Y");
    };


    return <>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        {holiday.title}
        {holiday.isAnnual && <Chip label="ANNUAL" color="secondary" />}
      </DialogTitle>
      <DialogContent>
        <Grid container sx={{ mt: 2 }} spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ mb: 1 }}><strong>Start Date</strong></Typography>
            <InfoTextField value={formatDate(holiday.startDate)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ mb: 1 }}><strong>End Date</strong></Typography>
            <InfoTextField value={formatDate(holiday.endDate)} />
          </Grid>
        </Grid>
        <Typography sx={{ mt: 2, mb: 1 }}><strong>Notes</strong></Typography>
        <InfoTextField value={holiday.note || ""} multiline minRows={3} />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleClose}>Close</Button>
      </DialogActions>
    </>
  }

  return <Dialog fullWidth maxWidth="md" onClose={handleClose} {...props}>
    {!holiday && <Alert severity="error">Cannot fetch holiday data</Alert>}
    {holiday && renderHoliday(holiday)}
  </Dialog>
}

export default HolidayDetail;