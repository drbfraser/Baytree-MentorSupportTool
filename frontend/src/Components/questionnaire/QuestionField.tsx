import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField, useMediaQuery, useTheme
} from "@mui/material";
import { useField } from "formik";
import { FunctionComponent } from "react";

const choices = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree"
];

export const TextQuestion: FunctionComponent<{ name: string, autoFill?: boolean }> = ({ name, autoFill }) => {
  const [field] = useField(name);
  return <TextField sx={{ my: 3 }} variant="outlined" {...field} disabled={!!autoFill} />;
};

// Reponsive choice question
// Horizontal on large screen
// Vertical form in small screen
export const ChoiceQuestion: FunctionComponent<{ name: string, autoFill?: boolean }> = ({
  name, autoFill
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
