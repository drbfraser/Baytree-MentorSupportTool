import {
  FormControlLabel,
  Radio,
  RadioGroup,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useField } from 'formik'
import type { FunctionComponent } from 'react'
import type { Question } from '../../api/misc'

export const isChoiceQuestion = (question: Question) => {
  return (
    question.inputType === 'radio'
  )
}

// Reponsive choice question
// Horizontal on large screen
// Vertical form in small screen
export const ChoiceInput: FunctionComponent<{ question: Question }> = ({
  question
}) => {
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const [field] = useField(question.QuestionID)
  const Choices = question.valueList.items


  return (
    <RadioGroup
      {...field}
      row={isLargeScreen}
      sx={{ mt: 2 }}
      style={{ justifyContent: isLargeScreen ? 'space-between' : 'inherit' }}
    >
      {Choices.map((choice, index) => (
        <FormControlLabel
          key={`${index}`}
          value={`${choice}`}
          control={<Radio />}
          label={choice}
          labelPlacement={isLargeScreen ? 'top' : 'end'}
        />
      ))}
    </RadioGroup>
  )
}

export default ChoiceInput
