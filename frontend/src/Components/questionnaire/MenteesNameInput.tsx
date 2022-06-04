import { MenuItem, Select } from "@mui/material";

import { FunctionComponent } from "react";
import { Participant } from "../../api/views";

// This is a temporary fix the error of the Select options
type OnInputChange = {
  (e: React.ChangeEvent<any>): void;
  <T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
}

interface Props {
  name: string,
  onChange: OnInputChange,
  menteeList: Participant[];
  defaultMentee?: string;
}

const MenteesNameInput: FunctionComponent<Props> = ({ name, onChange, menteeList, defaultMentee }) => {
  return (
    <Select name={name} onChange={onChange} defaultValue={defaultMentee} displayEmpty>
      <MenuItem value="" disabled>Please select a mentee</MenuItem>
      {menteeList.map((mentee, index) =>  {
        const fullName = `${mentee.firstName} ${mentee.lastName}`
        return <MenuItem key={index} value={fullName}>{fullName}</MenuItem>
      }
      )}
    </Select>
  )
}

export default MenteesNameInput;