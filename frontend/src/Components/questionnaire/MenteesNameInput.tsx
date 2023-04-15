import { FormHelperText, MenuItem, Select } from '@mui/material'
import { useField } from 'formik'
import type { Question } from '../../api/misc'
import type { Participant } from '../../api/views'

function MenteesNameInput({ question, menteeList}: {question: Question, menteeList: Participant[]}): JSX.Element {
  const [field, meta] = useField(question.QuestionID)
  const error = meta.touched && field.value === ''

  return (
    <>
      <Select
        sx={{ mt: 1 }}
        {...field}
        defaultValue=""
        displayEmpty
        error={meta.touched && field.value === ''}
      >
        <MenuItem value="" disabled>
          Please select a mentee
        </MenuItem>
        {menteeList.map((mentee, index) => {
          const fullName = `${mentee.firstName} ${mentee.lastName}`
          return (
            <MenuItem key={index} value={fullName}>
              {fullName}
            </MenuItem>
          )
        })}
      </Select>
      {error && <FormHelperText error>Required</FormHelperText>}
    </>
  )
}

export default MenteesNameInput
