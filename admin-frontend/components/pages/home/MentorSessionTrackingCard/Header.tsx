import {
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Skeleton,
  InputLabel,
  FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdOutlineFileDownload, MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  getMentorRoles,
  MentorRole,
} from "../../../../api/backend/mentorRoles";
import { getSessionGroupFromViews } from "../../../../api/backend/views/sessionGroups";
import { MOBILE_BREAKPOINT } from "../../../../constants/constants";
import PaginatedSelect from "../../../shared/paginatedSelect";
import { SessionGroup } from "./MentorSessionTrackingCard/MentorSessionTrackingCard";

interface HeaderProps {
  onSessionGroupSelectOptionChange: (newSessionGroupId: any) => void;

  onSetYear: (year: number) => void;
  curYear: number;

  mentorFilter: string;
  setMentorFilter: (newMentorFilter: string) => void;

  onExportButtonClick: () => void;
}

const Header: React.FunctionComponent<HeaderProps> = (props) => {
  return (
    <>
      <HeaderLayout>
        <HeaderTitle></HeaderTitle>
        <SelectSessionGroup
          onSessionGroupSelectOptionChange={
            props.onSessionGroupSelectOptionChange
          }
        ></SelectSessionGroup>
        <SelectDate>
          <SelectYear
            curYear={props.curYear}
            onSetYear={props.onSetYear}
          ></SelectYear>
        </SelectDate>
        <SearchBox
          mentorFilter={props.mentorFilter}
          setMentorFilter={props.setMentorFilter}
        ></SearchBox>
        <Button
          variant="contained"
          onClick={props.onExportButtonClick}
          endIcon={<MdOutlineFileDownload />}
        >
          Export
        </Button>
      </HeaderLayout>
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
    "selectDate searchBox exportButton";

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "title settingsButton"
      "selectSessionGroup selectSessionGroup"
      "selectDate selectDate"
      "searchBox searchBox"
      "exportButton exportButton";
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
  onSessionGroupSelectOptionChange: (newSessionGroup: SessionGroup) => void;
}

const SelectSessionGroup: React.FunctionComponent<SelectSessionGroupProps> = (
  props
) => {
  interface sessionGroupOption {
    id: number;
    name: string;
  }
  const [sessionGroupOptions, setSessionGroupOptions] = useState<
    sessionGroupOption[] | null
  >(null);

  useEffect(() => {
    // Get the current mentor roles in the database
    getMentorRoles().then(async (response) => {
      if (response) {
        // Once the mentor roles are fetched, fetch the session group information for each mentor role
        const mentorRoles = response as MentorRole[];
        const sessionGroups = await Promise.all(
          mentorRoles.map(async (mentorRole) => {
            const sessionGroup = await getSessionGroupFromViews(
              mentorRole.viewsSessionGroupId
            );

            if (sessionGroup) {
              // For each mentor role session group, we will need the id and name for select options
              return {
                id: sessionGroup.viewsSessionGroupId,
                name: sessionGroup.name,
              };
            } else {
              toast.error(
                "Failed to get session group information for a mentor role."
              );
            }
          })
        );
        if (sessionGroups.every((sessionGroup) => !!sessionGroup)) {
          setSessionGroupOptions(sessionGroups as any);
        }
      } else {
        toast.error("Failed to get mentor roles for session statistics.");
      }
    });
  }, []);

  return (
    <StyledSessionGroup>
      {!sessionGroupOptions ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <FormControl fullWidth>
          <InputLabel id="select-session-group-statistics-label">
            Session Group
          </InputLabel>
          <Select
            labelId="select-session-group-statistics-label"
            label="Session Group"
            defaultValue=""
            id="select-session-group-statistics"
            fullWidth
            variant="outlined"
            onChange={(event) =>
              props.onSessionGroupSelectOptionChange({
                id: event.target.value,
                name: event.target.name,
              })
            }
          >
            {sessionGroupOptions.map((sessionGroup, i) => (
              <MenuItem key={i} value={sessionGroup.id.toString()}>
                {sessionGroup.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </StyledSessionGroup>
  );
};

const StyledSessionGroup = styled.div`
  width: 20rem;
  grid-area: selectSessionGroup;
  padding-left: 2rem;

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    padding-left: 0;
  }
`;

const SelectDate = styled.div`
  display: flex;
  grid-area: selectDate;
  align-items: center;
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
        label="Year"
        onChange={(event: SelectChangeEvent) => {
          props.onSetYear(parseInt(event.target.value));
        }}
      >
        {getPastYears().map((year, i) => (
          <MenuItem key={i} value={year}>
            {`${year}/${year + 1}`}
          </MenuItem>
        ))}
      </Select>
    </StyledSelectYear>
  );
};

const StyledSelectYear = styled.div`
  grid-area: selectYear;
  width: auto;
`;

interface SearchBoxProps {
  mentorFilter: string;
  setMentorFilter: (newMentorFilter: string) => void;
}

const SearchBox: React.FunctionComponent<SearchBoxProps> = (props) => {
  return (
    <StyledSearchBox>
      <TextField
        fullWidth
        name="mentorFilter"
        label="Search Name or Email"
        type="mentorFilter"
        id="mentorFilter"
        value={props.mentorFilter}
        onChange={(e: any) => props.setMentorFilter(e.target.value)}
        sx={{ maxWidth: "24rem" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <MdSearch />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </StyledSearchBox>
  );
};

const StyledSearchBox = styled.div`
  grid-area: searchBox;
  align-self: center;
  margin-left: 2rem;

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    margin-left: 0;
  }
`;

export default Header;
