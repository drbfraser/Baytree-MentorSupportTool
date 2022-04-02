import {
  Button,
  Input,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import styled from "styled-components";
import { getMonthlyExpectedSessionCount } from "../../../../api/backend/monthlyExpectedSessionCounts";
import { MONTH_NAMES, tryParseInt } from "../../../../util/misc";

interface SettingsModalProps {
  curYear: number;
  curMonth: number;
  saveExpectedMonthCounts: (year: number, newCounts: number[]) => void;
}

const SettingsModal: React.FunctionComponent<SettingsModalProps> = (props) => {
  const [selectedYear, setSelectedYear] = useState(props.curYear);
  const [sessionNumbers, setSessionNumbers] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  const getExpectedSessionNumbersPerMonth = async () => {
    const apiRes = await getMonthlyExpectedSessionCount(undefined, undefined, {
      id: selectedYear.toString(),
    });

    if (
      apiRes &&
      apiRes.status === 200 &&
      apiRes.data &&
      apiRes.data.length > 0
    ) {
      let expectedSessionsPerMonth: number[] = [];
      const expectedSessionsPerMonthRes = apiRes.data[0];
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.january_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.february_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.march_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.april_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.may_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.june_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.july_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.august_count);
      expectedSessionsPerMonth.push(
        expectedSessionsPerMonthRes.september_count
      );
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.october_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.november_count);
      expectedSessionsPerMonth.push(expectedSessionsPerMonthRes.december_count);

      setSessionNumbers(expectedSessionsPerMonth);
    } else {
      setSessionNumbers([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
  };

  useEffect(() => {
    getExpectedSessionNumbersPerMonth();
  }, [selectedYear]);

  return (
    <SettingsModalLayout>
      <Title variant="h5">Expected Sessions for: </Title>
      <SelectYear
        curYear={selectedYear}
        onSetYear={setSelectedYear}
      ></SelectYear>
      <SaveButton
        onClick={() => {
          props.saveExpectedMonthCounts(selectedYear, sessionNumbers);
        }}
        startIcon={<MdSave></MdSave>}
        color="success"
        size="medium"
        variant="outlined"
      >
        Save
      </SaveButton>
      <MonthInputs>
        {sessionNumbers.map((sessionNumber, i) => (
          <MonthInput>
            <Typography variant="h5">{`${MONTH_NAMES[i]}: `}</Typography>
            <TextField
              value={sessionNumbers[i]}
              margin="normal"
              style={{ maxWidth: "6rem" }}
              onChange={(event) => {
                let curSessionNumbers = sessionNumbers;
                curSessionNumbers[i] = tryParseInt(event.target.value, 0);
                setSessionNumbers(curSessionNumbers);
              }}
            />
          </MonthInput>
        ))}
      </MonthInputs>
    </SettingsModalLayout>
  );
};

const Title = styled(Typography)`
  grid-area: title;
`;

const SettingsModalLayout = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    "title selectYear saveButton"
    "monthInputs monthInputs monthInputs";
`;

interface SelectYearProps {
  onSetYear: (year: number) => void;
  curYear: number;
}

const SelectYear: React.FunctionComponent<SelectYearProps> = (props) => {
  const YEARS_RANGE = 3;

  const getNearbyYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - YEARS_RANGE;
    const endYear = currentYear + YEARS_RANGE;
    let nearbyYears = [];
    for (let year = startYear; year <= endYear; ++year) {
      nearbyYears.push(year);
    }
    return nearbyYears;
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
        {getNearbyYears().map((year) => (
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

const SaveButton = styled(Button)`
  grid-area: saveButton;
`;

const MonthInputs = styled.div`
  grid-area: monthInputs;
  display: flex;
  flex-wrap: wrap;
`;

const MonthInput = styled.div`
  display: flex;
  width: 100%;
`;

export default SettingsModal;
