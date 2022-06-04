import { MenuItem, Select } from "@mui/material";

import { FunctionComponent } from "react";
import { Mentee } from "../sessions/session";

// This is a temporary fix the error
type OnInputChange = {
  (e: React.ChangeEvent<any>): void;
  <T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
}

interface Props {
  name: string,
  onChange: OnInputChange,
  menteeList: Mentee[];
  defaultMentee?: string;
}

const MenteesNameInput: FunctionComponent<Props> = ({ name, onChange, menteeList, defaultMentee }) => {
  return (
    <Select name={name} onChange={onChange} defaultValue={defaultMentee} displayEmpty>
      <MenuItem value="" disabled>Please select a mentee</MenuItem>
      {menteeList.map((mentee, index) => 
        <MenuItem key={index} value={mentee.name}>{mentee.name}</MenuItem>
      )}
    </Select>
  )
}

export default MenteesNameInput;