import {
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { MdMoreVert } from "react-icons/md";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "../../../../constants/constants";
import Modal from "../../../shared/Modal";
import PaginatedSelect from "../../../shared/paginatedSelect";
import SettingsModal from "./SettingsModal";

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

  setExpectedMonthCounts: (newMonthCounts: number[]) => void;
  expectedMonthCounts: number[];
}

const Header: React.FunctionComponent<HeaderProps> = (props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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
        <SelectDate>
          <SelectYear
            curYear={props.curYear}
            onSetYear={props.onSetYear}
          ></SelectYear>
          <SelectMonth
            curMonth={props.curMonth}
            onSetMonth={props.onSetMonth}
          ></SelectMonth>
        </SelectDate>
        <SettingsButton
          onClick={() => setIsSettingsModalOpen(true)}
        ></SettingsButton>
      </HeaderLayout>
      <Modal
        isOpen={isSettingsModalOpen}
        modalComponent={
          <SettingsModal
            setExpectedMonthCounts={props.setExpectedMonthCounts}
            expectedMonthCounts={props.expectedMonthCounts}
          ></SettingsModal>
        }
        onOutsideClick={() => setIsSettingsModalOpen(false)}
      ></Modal>
    </>
  );
};

const HeaderLayout = styled.div`
  display: grid;
  flex-wrap: wrap;
  grid-area: "Header";
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
  grid-row-gap: 1rem;
  grid-template-areas:
    "title selectSessionGroup settingsButton"
    "selectDate selectDate selectDate";

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "title settingsButton"
      "selectSessionGroup selectSessionGroup"
      "selectDate selectDate";
  }
`;

const HeaderTitle: React.FunctionComponent<{}> = () => {
  return (
    <StyledHeaderTitle>
      <Typography variant="h5">Sessions</Typography>
    </StyledHeaderTitle>
  );
};

const StyledHeaderTitle = styled.div`
  grid-area: title;
`;
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
  max-width: 20rem;
  grid-area: selectSessionGroup;
  padding-left: 2rem;

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    padding-left: 0;
  }
`;

const SelectDate = styled.div`
  display: flex;
  grid-area: selectDate;
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
    <StyledSelectYear>
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
    </StyledSelectYear>
  );
};

const StyledSelectYear = styled.div`
  grid-area: selectYear;
  width: auto;
`;

interface SelectMonthProps {
  onSetMonth: (month: number) => void;
  curMonth: number;
}

const SelectMonth: React.FunctionComponent<SelectMonthProps> = (props) => {
  return (
    <StyledSelectMonth>
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
    </StyledSelectMonth>
  );
};

const StyledSelectMonth = styled.div`
  padding-left: 2rem;
  grid-area: selectMonth;
  justify-self: flex-start;
`;

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton: React.FunctionComponent<SettingsButtonProps> = (
  props
) => {
  return (
    <StyledSettingsButton>
      <IconButton onClick={props.onClick}>
        <MdMoreVert></MdMoreVert>
      </IconButton>
    </StyledSettingsButton>
  );
};

const StyledSettingsButton = styled.div`
  grid-area: settingsButton;
  justify-self: flex-end;
`;

export default Header;
