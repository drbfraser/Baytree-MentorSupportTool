import { FormControlLabel, Radio, RadioGroup, useMediaQuery, useTheme } from "@mui/material";
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

export const isChoiceQuestion = (question: Question) => {
  return question.inputType === "number" && question.validation.includes("range[1,5]")
}

// Reponsive choice question
// Horizontal on large screen
// Vertical form in small screen
export const ChoiceInput: FunctionComponent<{ question: Question }> = ({
  question
}) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [field] = useField(question.QuestionID);

  return (
    <RadioGroup
      {...field}
      row={isLargeScreen}
      sx={{ mt: 2 }}
      style={{ justifyContent: isLargeScreen ? "space-between" : "inherit" }}
    >
      {choices.map((choice, index) => (
        <FormControlLabel
          key={`${question.QuestionID}-${index}`}
          value={`${index + 1}`}
          control={<Radio />}
          label={choice}
          labelPlacement={isLargeScreen ? "top" : "end"}
        />
      ))}
    </RadioGroup>
  );
};

export default ChoiceInput;