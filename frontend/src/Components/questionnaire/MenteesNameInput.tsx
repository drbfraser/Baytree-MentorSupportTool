import { FormHelperText, MenuItem, Select } from "@mui/material";
import { useField } from "formik";

import { FunctionComponent } from "react";
import { Question } from "../../api/misc";
import { Participant } from "../../api/views";

interface Props {
  question: Question;
  menteeList: Participant[];
}

const MenteesNameInput: FunctionComponent<Props> = ({ question, menteeList }) => {
  const [field, meta] = useField(question.QuestionID);
  const error = meta.touched && field.value === ""

  return (
    <>
    <Select sx={{ mt: 1 }} {...field} defaultValue="" displayEmpty error={meta.touched && field.value === ""}>
      <MenuItem value="" disabled>Please select a mentee</MenuItem>
      {menteeList.map((mentee, index) =>  {
        const fullName = `${mentee.firstName} ${mentee.lastName}`
        return <MenuItem key={index} value={fullName}>{fullName}</MenuItem>
      })}
    </Select>
    {error && <FormHelperText error>Required</FormHelperText> }
    </>
  )
}

export default MenteesNameInput;