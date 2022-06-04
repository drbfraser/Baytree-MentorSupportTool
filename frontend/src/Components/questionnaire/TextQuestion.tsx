import { TextField } from "@mui/material";
import { useField } from "formik";
import { FunctionComponent } from "react";
import { Question } from "../../api/misc";

const TextQuestion: FunctionComponent<{ question: Question, autoFill?: boolean }> = ({ question, autoFill }) => {
  const [field] = useField(question.QuestionID);

  // Get the range if the type is a number

  return <TextField 
    type={question.inputType} 
    sx={{ my: 3 }} 
    variant="outlined" {...field} 
    disabled={!!autoFill} />;
};

export default TextQuestion;
