import {
  Typography,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
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

  onSetYear: (year: number) => void;
  curYear: number;
}

const Header: React.FunctionComponent<HeaderProps> = (props) => {
  return (
    <>
      <HeaderLayout>
        <HeaderTitle></HeaderTitle>
        <SelectSessionGroup
          loadSessionGroupOptions={props.loadSessionGroupOptions}
          onSessionGroupSelectOptionChange={
            props.onSessionGroupSelectOptionChange
          }
        ></SelectSessionGroup>
        <SelectYear
          curYear={props.curYear}
          onSetYear={props.onSetYear}
        ></SelectYear>
        <SelectMonth
          curMonth={props.curMonth}
          onSetMonth={props.onSetMonth}
        ></SelectMonth>
      </HeaderLayout>
    </>
  );
};

const HeaderLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-area: "Header";
`;

const HeaderTitle: React.FunctionComponent<{}> = () => {
  return <Typography variant="h5">Sessions</Typography>;
};

interface SelectSessionGroupProps {
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
}

const SelectSessionGroup: React.FunctionComponent<SelectSessionGroupProps> = (
  props
) => {
  return (
    <StyledSessionGroup>
      <PaginatedSelect
        isMulti={false}
        loadOptions={props.loadSessionGroupOptions}
        onChange={props.onSessionGroupSelectOptionChange}
        placeholder="Select a session group..."
      ></PaginatedSelect>
    </StyledSessionGroup>
  );
};

const StyledSessionGroup = styled.div`
  width: 15rem;
  padding-left: 2rem;
  padding-bottom: 1rem;
`;

interface SelectYearProps {
  onSetYear: (year: number) => void;
  curYear: number;
}

const SelectYear: React.FunctionComponent<SelectYearProps> = (props) => {
  const PAST_YEARS_RANGE = 3;

  const getPastYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - PAST_YEARS_RANGE;
    let pastYears = [];
    for (let year = startYear; year <= currentYear; ++year) {
      pastYears.push(year);
    }
    return pastYears;
  };

  return (
    <StyledSelect>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.curYear.toString()}
        label="Month"
        onChange={(event: SelectChangeEvent) => {
          props.onSetYear(parseInt(event.target.value));
        }}
      >
        {getPastYears().map((year) => (
          <MenuItem value={year}>{year.toString()}</MenuItem>
        ))}
      </Select>
    </StyledSelect>
  );
};

interface SelectMonthProps {
  onSetMonth: (month: number) => void;
  curMonth: number;
}

const SelectMonth: React.FunctionComponent<SelectMonthProps> = (props) => {
  return (
    <StyledSelect>
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
    </StyledSelect>
  );
};

const StyledSelect = styled.div`
  padding-left: 2rem;
`;

interface MoreButtonProps {
  onClick: () => void;
}

const MoreButton: React.FunctionComponent<MoreButtonProps> = (props) => {
  return (
    <Button variant="outlined" color="success" onClick={() => props.onClick()}>
      More
    </Button>
  );
};

export default Header;
