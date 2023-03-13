import { TextField } from '@mui/material'
import { useField } from 'formik'
import type { FunctionComponent } from 'react'
import type { Question } from '../../api/misc'

const MentorNameInput: FunctionComponent<{ question: Question }> = ({
  question
}) => {
  const [field] = useField(question.QuestionID)
  return (
    <TextField
      type={question.inputType}
      sx={{ mt: 1 }}
      variant="outlined"
      disabled
      {...field}
    />
  )
}

export default MentorNameInput
