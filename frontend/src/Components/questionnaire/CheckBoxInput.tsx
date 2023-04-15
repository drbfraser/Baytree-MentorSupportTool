import {
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Checkbox,
  FormGroup,
} from '@mui/material'
import { useField } from 'formik'
import type { FunctionComponent} from 'react'
import type { Question } from '../../api/misc'

export const isCheckBoxQuestion = (question: Question) => {
  return (
    question.inputType === 'checkselect'
  )
}

// Reponsive CheckBox question
// Horizontal on large screen
// Vertical form in small screen
export const CheckBoxInput: FunctionComponent<{ question: Question }> = ({
  question
}) => {

  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const [field] = useField(question.QuestionID)
  const ValueList = question.valueList.items

  let choices:string[] = []

  const handleChoicesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked){
      choices = [...choices, event.target.value]
    }
    else{
      choices = choices.filter( c => c !== event.target.value)
    }
  }
  return (
    <FormGroup
      {...field}
      row={isLargeScreen}
      sx={{ mt: 2 }}
      style={{ justifyContent: isLargeScreen ? 'space-between' : 'inherit' }}
    >
      {ValueList.map((value, index) => (
        <FormControlLabel
          key={`${index}`}
          value={`${choices.toString()}`}
          control={<Checkbox onChange={handleChoicesChange} name={question.QuestionID} value={value}/>}
          label={value}
          labelPlacement={isLargeScreen ? 'top' : 'end'}
        />
      ))}
    </FormGroup>
  )
}
export default CheckBoxInput

