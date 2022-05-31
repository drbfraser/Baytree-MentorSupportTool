import { Alert, AlertTitle } from "@mui/material";

const InvalidQuestionnaire = () => {
  return (
    <Alert severity="error">
      <AlertTitle>Some questions has unsupported input types</AlertTitle>
      Please contact your adminstrators to resolve the issue.
    </Alert>
  )
}

export default InvalidQuestionnaire;