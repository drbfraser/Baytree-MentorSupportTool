import { useMediaQuery, useTheme, FormGroup } from '@mui/material'

import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useField } from 'formik'
import type { FunctionComponent } from 'react'
import type { Question } from '../../api/misc'
import { useState } from 'react'

export const isSelectorQuestion = (question: Question) => {
  return question.inputType === 'select' || question.inputType === 'selectother'
}

// Reponsive choice question
// Horizontal on large screen
// Vertical form in small screen
export const SelectorInput: FunctionComponent<{ question: Question }> = ({
  question
}) => {
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const [field] = useField(question.QuestionID)
  const values = question.valueList.items
  const [selector, setSelector] = useState('')

  //handle for selector change
  const onSelectChange = (event: SelectChangeEvent) => {
    event.preventDefault()
    setSelector(event.target.value as string)
  }

  return (
    <FormGroup
      {...field}
      row={isLargeScreen}
      sx={{ mt: 2 }}
      style={{ justifyContent: isLargeScreen ? 'space-evenly' : 'inherit' }}
    >
      <Select
        sx={{ mt: 1 }}
        id={question.QuestionID}
        value={selector}
        label="Select: "
        onChange={onSelectChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        native={true}
      >
        <option value="">None</option>
        {values
          ? values.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))
          : null}
      </Select>
    </FormGroup>
  )
}

export default SelectorInput
