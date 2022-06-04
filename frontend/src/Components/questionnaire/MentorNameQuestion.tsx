import { TextField } from "@mui/material";
import { useField } from "formik";
import { FunctionComponent } from "react";
import { Question } from "../../api/misc";

const MentorNameInput: FunctionComponent<{question: Question}> = ({ question }) => {
  const [field] = useField(question.QuestionID);
  return <TextField
    type={question.inputType}
    sx={{ my: 3 }}
    variant="outlined"
    disabled 
    {...field} />;
}

export default MentorNameInput;