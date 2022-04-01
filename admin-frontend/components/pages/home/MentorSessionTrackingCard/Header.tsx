import {
  Select,
  SelectChangeEvent,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import React from "react";
import styled from "styled-components";
import PaginatedSelect from "../../../shared/paginatedSelect";

interface HeaderProps {
  loadSessionGroupOptions: (
    search: any,
    prevOptions: any
  ) => Promise<{
    options: {
      value: string;
      label: string;
    }[];
    hasMore: boolean;
  }>;

  onSessionGroupSelectOptionChange: (newSessionGroupId: any) => void;
  onSetMonth: (month: number) => void;
  curMonth: number;
}

const Header: React.FunctionComponent<HeaderProps> = (props) => {
  return (
    <HeaderLayout>
      <HeaderTitle></HeaderTitle>
      <PaginatedSelect
        isMulti={false}
        loadOptions={props.loadSessionGroupOptions}
        onChange={props.onSessionGroupSelectOptionChange}
        placeholder="Select a session group..."
      ></PaginatedSelect>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.curMonth.toString()}
        label="Month"
        onChange={(event: SelectChangeEvent) => {
          props.onSetMonth(parseInt(event.target.value));
        }}
      >
        <MenuItem value={0}>Jan</MenuItem>
        <MenuItem value={1}>Feb</MenuItem>
        <MenuItem value={2}>Mar</MenuItem>
        <MenuItem value={3}>Apr</MenuItem>
        <MenuItem value={4}>May</MenuItem>
        <MenuItem value={5}>June</MenuItem>
        <MenuItem value={6}>July</MenuItem>
        <MenuItem value={7}>Aug</MenuItem>
        <MenuItem value={8}>Sept</MenuItem>
        <MenuItem value={9}>Oct</MenuItem>
        <MenuItem value={10}>Nov</MenuItem>
        <MenuItem value={11}>Dec</MenuItem>
      </Select>
      <MoreButton></MoreButton>
    </HeaderLayout>
  );
};

const HeaderLayout = styled.div`
  display: flex;
  justify-content: space-between;
  grid-area: "Header";
`;

const HeaderTitle: React.FunctionComponent<{}> = () => {
  return <Typography variant="h5">Sessions</Typography>;
};

const MoreButton: React.FunctionComponent<{}> = () => {
  return (
    <Button variant="outlined" color="success">
      More
    </Button>
  );
};

export default Header;
