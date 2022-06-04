import { useMediaQuery, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useField } from "formik";
import { FunctionComponent } from "react";
import { useTheme } from "@mui/material";
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
export const ChoiceQuestion: FunctionComponent<{ question: Question, autoFill?: boolean }> = ({
  question, autoFill
}) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [field] = useField(question.QuestionID);

  return (
    <RadioGroup
      {...field}
      row={isLargeScreen}
      sx={{ my: 3 }}
      style={{ justifyContent: isLargeScreen ? "space-between" : "inherit" }}
    >
      {choices.map((choice, index) => (
        <FormControlLabel
          disabled={!!autoFill}
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

export default ChoiceQuestion;