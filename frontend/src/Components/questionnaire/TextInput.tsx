import { FormHelperText, TextField } from "@mui/material";
import { useField } from "formik";
import { FunctionComponent } from "react";
import { Question } from "../../api/misc";

const TextInput: FunctionComponent<{ question: Question }> = ({ question }) => {
  const [field, meta] = useField(question.QuestionID);
  const error = field.value === "" && meta.touched

  return (
    <>
      <TextField
        type={question.inputType}
        sx={{ mt: 1 }}
        variant="outlined"
        {...field}
        error={error} />
      {error && <FormHelperText error>Required</FormHelperText>}
    </>
  );
};

export default TextInput;
