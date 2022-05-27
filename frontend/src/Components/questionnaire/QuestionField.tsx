import { useMediaQuery } from "@mui/material";
import {
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { useField } from "formik";
import { FunctionComponent } from "react";
import { Question } from "../../api/misc";

const choices = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree"
];

const TextQuestion: FunctionComponent<{ name: string }> = ({ name }) => {
  const [field] = useField(name);
  return <TextField sx={{ my: 3 }} variant="outlined" {...field} />;
};

// Reponsive choice question
// Horizontal on large screen
// Vertical form in small screen
export const ChoiceQuestion: FunctionComponent<{ name: string }> = ({
  name
}) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [field] = useField(name);

  return (
    <RadioGroup
      {...field}
      row={isLargeScreen}
      sx={{ my: 3 }}
      style={{ justifyContent: isLargeScreen ? "space-between" : "inherit" }}
    >
      {choices.map((choice, index) => (
        <FormControlLabel
          key={`${name}-${index}`}
          value={`${index + 1}`}
          control={<Radio />}
          label={choice}
          labelPlacement={isLargeScreen ? "top" : "end"}
        />
      ))}
    </RadioGroup>
  );
};

const QuestionField: FunctionComponent<{
  question: Question;
  numbering: number;
}> = ({ question, numbering }) => {
  const required = question.validation.includes("required");
  const name = question.QuestionID;

  return (
    <FormControl fullWidth required={required}>
      {/* Question labels */}
      <Typography
        sx={{
          mt: 3,
          fontWeight: "bold"
        }}
        color="text.secondary"
      >
        {`${numbering}. ${question.Question} ${required ? "*" : ""}`}
      </Typography>

      {/* Answer input */}
      {question.inputType === "number" ? (
        <ChoiceQuestion name={name} />
      ) : (
        <TextQuestion name={name} />
      )}
      <Divider />
    </FormControl>
  );
};

export default QuestionField;
