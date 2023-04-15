import { FormHelperText, TextField } from '@mui/material'
import { useField } from 'formik'
import type { FunctionComponent } from 'react'
import type { Question } from '../../api/misc'

const TextInput: FunctionComponent<{ question: Question }> = ({ question }) => {
  const [field, meta] = useField(question.QuestionID)
  const error = field.value === '' && meta.touched

  // check for range validation of number input field
  if (question.validation !== ''){
    const numberFieldRegEx = new RegExp('^range\\[[0-9],[0-9]')

    if (numberFieldRegEx.test(question.validation)){
        const pattern = /\d+/g
        const range = question.validation.match(pattern)
        let rangeError
        if (range) {
          const minNum:number = parseInt(range[0])
          const maxNum:number = parseInt(range[0])
          rangeError = (num:number) =>{
            return (minNum > num || num > maxNum) && meta.touched
          }
          return (
            <>
              <TextField
                  type={'number'}
                  sx={{ mt: 1 }}
                  variant="outlined"
                  {...field}
                  error={rangeError(field.value as number)}
              />
              {rangeError(field.value as number) && <FormHelperText error>please input a number in range of {minNum} - {maxNum}</FormHelperText>}
            </>
          )
        }
      }
    }
  // other text input without special case
  return (
    <>
      <TextField
        type={question.inputType}
        sx={{ mt: 1 }}
        variant="outlined"
        {...field}
        error={error}
      />
      {error && <FormHelperText error>Required</FormHelperText>}
    </>
  )
}

export default TextInput