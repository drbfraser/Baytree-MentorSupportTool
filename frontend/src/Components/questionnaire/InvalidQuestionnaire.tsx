import { Alert, AlertTitle } from '@mui/material'
import type { FunctionComponent } from 'react'

const InvalidQuestionnaire: FunctionComponent<{ error: string }> = ({
  error
}) => {
  return (
    <Alert severity="error" sx={{ my: 3 }}>
      <AlertTitle>An error has occurred</AlertTitle>
      Please refresh the page or contact your adminstrators to resolve the
      issue. <br />
      Reason: {error}
    </Alert>
  )
}

export default InvalidQuestionnaire
