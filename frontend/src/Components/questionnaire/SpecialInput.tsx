import {
  FormControlLabel, FormHelperText,
  Radio,
  RadioGroup, TextField,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useField } from "formik";
import type { FunctionComponent } from "react";
import type { Question } from "../../api/misc";

const choices = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree"
];


export const isSpecialQuestion = (question: Question) => {
  return question.inputType == "phone_number" || question.validation == "valid_postcode";
};


// Special Question
// Horizontal on large screen
// Vertical form in small screen
export const SpecialInput: FunctionComponent<{ question: Question }> = ({
  question
}) => {
  const [field, meta] = useField(question.QuestionID);

  const error = field.value === "" && meta.touched;
  // check for phone validation
  const matchUkPhoneNumber = (phoneNumber:string) =>{
    // https://regexlib.com/Search.aspx?k=uk%20telephone
    const phoneRegEx = new RegExp('^\\(?(?:(?:0(?:0|11)\\)?[\\s-]?\\(?|\\+)44\\)?[\\s-]?\\(?(?:0\\)?[\\s-]?\\(?)?|0)(?:\\d{2}\\)?[\\s-]?\\d{4}[\\s-]?\\d{4}|\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{3,4}|\\d{4}\\)?[\\s-]?(?:\\d{5}|\\d{3}[\\s-]?\\d{3})|\\d{5}\\)?[\\s-]?\\d{4,5}|8(?:00[\\s-]?11[\\s-]?11|45[\\s-]?46[\\s-]?4\\d))(?:(?:[\\s-]?(?:x|ext\\.?\\s?|\\#)\\d+)?)$')
    return !phoneRegEx.test(phoneNumber) && meta.touched;
  }
  // check for postal code validation
  const matchUkPostalCode = (postal:string) =>{
    // https://regexlib.com/Search.aspx?k=uk%20postcode
    const postalRegEx = new RegExp('^[A-Za-z]{1,2}[0-9A-Za-z]{1,2}[ ]?[0-9]{0,1}[A-Za-z]{2}$')
    return !postalRegEx.test(postal) && meta.touched;
  }
  // phone field return
  if (question.inputType == "phone_number"){
    return (
        <>
          <TextField
              type={question.inputType}
              sx={{ mt: 1 }}
              variant="outlined"
              {...field}
              error={matchUkPhoneNumber(field.value)}
          />
          {matchUkPhoneNumber(field.value) && <FormHelperText error>Invalid Phone Number</FormHelperText>}
        </>
    )
  }

  // postal code field return
  if(question.validation == "valid_postcode"){
    return(
        <>
          <TextField
              type={question.inputType}
              sx={{ mt: 1 }}
              variant="outlined"
              {...field}
              error={matchUkPostalCode(field.value)}
          />
          {matchUkPostalCode(field.value) && <FormHelperText error>Invalid Postal Code</FormHelperText>}
        </>
    )
  }
  return (<></>)


};

export default SpecialInput;
