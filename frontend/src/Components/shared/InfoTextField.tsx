import { TextField, TextFieldProps } from "@mui/material";
import { FunctionComponent } from "react";

const InfoTextField: FunctionComponent<TextFieldProps> = (props) => {
  return (
    <TextField
      {...props}
      fullWidth
      disabled
      value={props.value || ""} />
  )
};

export default InfoTextField;