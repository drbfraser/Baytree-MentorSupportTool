import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  type DialogProps
} from '@mui/material'
import { formatInTimeZone } from 'date-fns-tz'
import type { FunctionComponent } from 'react'
import type { SpecialEvent } from '../../api/misc'
import { TIMEZONE_ID } from '../../Utils/locale'
import InfoTextField from '../shared/InfoTextField'

type Props = {
  specialEvent?: SpecialEvent | undefined
  handleClose: () => void
} & DialogProps

const SpecialEventDetail: FunctionComponent<Props> = ({
  specialEvent,
  handleClose,
  ...props
}) => {
  const renderHoliday = (event: SpecialEvent) => {
    const formatDate = (date: string) => {
      return formatInTimeZone(new Date(date), TIMEZONE_ID, 'd MMM Y')
    }

    return (
      <>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {event.title}
          {event.isAnnual && <Chip label="ANNUAL" color="secondary" />}
        </DialogTitle>
        <DialogContent>
          <Grid container sx={{ mt: 2 }} spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ mb: 1 }}>
                <strong>Start Date</strong>
              </Typography>
              <InfoTextField value={formatDate(event.startDate)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ mb: 1 }}>
                <strong>End Date</strong>
              </Typography>
              <InfoTextField value={formatDate(event.endDate)} />
            </Grid>
          </Grid>
          <Typography sx={{ mt: 2, mb: 1 }}>
            <strong>Notes</strong>
          </Typography>
          <InfoTextField value={event.note || ''} multiline minRows={3} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </>
    )
  }

  return (
    <Dialog fullWidth maxWidth="md" onClose={handleClose} {...props}>
      {!specialEvent && (
        <Alert severity="error">Cannot fetch holiday data</Alert>
      )}
      {specialEvent && renderHoliday(specialEvent)}
    </Dialog>
  )
}

export default SpecialEventDetail
