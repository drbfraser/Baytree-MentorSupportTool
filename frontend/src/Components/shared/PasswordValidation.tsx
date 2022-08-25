import { Box, Icon, Typography } from "@mui/material";
import type { FunctionComponent } from "react";
import { MdCheckCircle, MdError } from "react-icons/md";

const ValidationMessage: FunctionComponent<{ label: string; validated: boolean; }> = ({ label, validated }) => {
  return (
    <Box display="flex" alignItems="center">
      <Icon
        color={validated ? "primary" : "error"}
        component={validated ? MdCheckCircle : MdError}
        fontSize="small"
        sx={{ m: 0.5 }}
      />
      <Typography variant="subtitle2" color={validated ? "primary" : "error"}>{label}</Typography>
    </Box>
  );
};

const hasValidLength = (password: string) => password.length >= 8 && password.length <= 30;
const hasNumber = (password: string) => /\d/.test(password);
const hasLowercase = (password: string) => /[a-z]/.test(password);
const hasUppercase = (password: string) => /[A-Z]/.test(password);
const hasSpecial = (password: string) => /\W/.test(password);
const isMatch = (password1: string) => (password2: string) => password1 === password2;

export const isValid = (password: string, passwordAgain: string) =>
  [hasValidLength, hasNumber, hasLowercase, hasUppercase, hasSpecial, isMatch(passwordAgain)]
    .map(check => check(password)).every(result => result);

const PasswordValidation: FunctionComponent<{ password: string; passwordAgain: string }> = ({ password, passwordAgain }) => {
  return <Box padding={1} sx={{ backgroundColor: "rgba(0, 0, 0, 0.05)", my: 2 }}>
    <ValidationMessage validated={hasValidLength(password)} label="Contains 8 - 30 characters" />
    <ValidationMessage validated={hasNumber(password)} label="Contains at least one number" />
    <ValidationMessage validated={hasLowercase(password)} label="Contains at least one lowercase letter" />
    <ValidationMessage validated={hasUppercase(password)} label="Contains at least one uppercase letter" />
    <ValidationMessage validated={hasSpecial(password)} label="Contains at least one special character" />
    <ValidationMessage validated={isMatch(password)(passwordAgain)} label="Passwords match" />
  </Box>
};

export default PasswordValidation;