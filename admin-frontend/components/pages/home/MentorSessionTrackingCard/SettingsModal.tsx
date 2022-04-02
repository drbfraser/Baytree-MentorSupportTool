import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getMonthlyExpectedSessionCount } from "../../../../api/backend/monthlyExpectedSessionCounts";

interface SettingsModalProps {
  curYear: number;
  curMonth: number;
  saveExpectedMonthCounts: (year: number, newCounts: number[]) => void;
}

const SettingsModal: React.FunctionComponent<SettingsModalProps> = (props) => {
  const [selectedYear, setSelectedYear] = useState(props.curYear);
  const [januaryCount, setJanuaryCount] = useState("0");
  const [februaryCount, setFebruaryCount] = useState("0");
  const [marchCount, setMarchCount] = useState("0");
  const [aprilCount, setAprilCount] = useState("0");
  const [mayCount, setMayCount] = useState("0");
  const [juneCount, setJuneCount] = useState("0");
  const [julyCount, setJulyCount] = useState("0");
  const [augustCount, setAugustCount] = useState("0");
  const [septemberCount, setSeptemberCount] = useState("0");
  const [octoberCount, setOctoberCount] = useState("0");
  const [novemberCount, setNovemberCount] = useState("0");
  const [decemberCount, setDecemberCount] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const getExpectedSessionNumbersPerMonth = async () => {
    setIsLoading(true);
    const apiRes = await getMonthlyExpectedSessionCount(undefined, undefined, {
      id: selectedYear.toString(),
    });

    if (
      apiRes &&
      apiRes.status === 200 &&
      apiRes.data &&
      apiRes.data.length > 0
    ) {
      const expectedSessionsPerMonthRes = apiRes.data[0];
      setJanuaryCount(expectedSessionsPerMonthRes.january_count.toString());
      setFebruaryCount(expectedSessionsPerMonthRes.february_count.toString());
      setMarchCount(expectedSessionsPerMonthRes.march_count.toString());
      setAprilCount(expectedSessionsPerMonthRes.april_count.toString());
      setMayCount(expectedSessionsPerMonthRes.may_count.toString());
      setJuneCount(expectedSessionsPerMonthRes.june_count.toString());
      setJulyCount(expectedSessionsPerMonthRes.july_count.toString());
      setAugustCount(expectedSessionsPerMonthRes.august_count.toString());
      setSeptemberCount(expectedSessionsPerMonthRes.september_count.toString());
      setOctoberCount(expectedSessionsPerMonthRes.october_count.toString());
      setNovemberCount(expectedSessionsPerMonthRes.november_count.toString());
      setDecemberCount(expectedSessionsPerMonthRes.december_count.toString());
    } else {
      setJanuaryCount("0");
      setFebruaryCount("0");
      setMarchCount("0");
      setAprilCount("0");
      setMayCount("0");
      setJuneCount("0");
      setJulyCount("0");
      setAugustCount("0");
      setSeptemberCount("0");
      setOctoberCount("0");
      setNovemberCount("0");
      setDecemberCount("0");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getExpectedSessionNumbersPerMonth();
  }, [selectedYear]);

  return isLoading ? (
    <LoadingSkeletons></LoadingSkeletons>
  ) : (
    <SettingsModalLayout>
      <TitleAndYear>
        <Title variant="h5">Expected Sessions for: </Title>
        <SelectYear
          curYear={selectedYear}
          onSetYear={setSelectedYear}
        ></SelectYear>
      </TitleAndYear>

      <SaveButton
        onClick={async () => {
          try {
            setIsLoading(true);
            await props.saveExpectedMonthCounts(selectedYear, [
              parseInt(januaryCount),
              parseInt(februaryCount),
              parseInt(marchCount),
              parseInt(aprilCount),
              parseInt(mayCount),
              parseInt(juneCount),
              parseInt(julyCount),
              parseInt(augustCount),
              parseInt(septemberCount),
              parseInt(octoberCount),
              parseInt(novemberCount),
              parseInt(decemberCount),
            ]);
          } catch {
          } finally {
            setIsLoading(false);
          }
        }}
        startIcon={<MdSave></MdSave>}
        color="success"
        size="medium"
        variant="contained"
      >
        Save
      </SaveButton>
      <MonthInputs>
        <MonthInput>
          <MonthCaption variant="h6">{`January:`}</MonthCaption>
          <TextField
            value={januaryCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setJanuaryCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`February:`}</MonthCaption>
          <TextField
            value={februaryCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setFebruaryCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`March:`}</MonthCaption>
          <TextField
            value={marchCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setMarchCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`April:`}</MonthCaption>
          <TextField
            value={aprilCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setAprilCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`May:`}</MonthCaption>
          <TextField
            value={mayCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setMayCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`June:`}</MonthCaption>
          <TextField
            value={juneCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setJuneCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`July:`}</MonthCaption>
          <TextField
            value={julyCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setJulyCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`August:`}</MonthCaption>
          <TextField
            value={augustCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setAugustCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`September:`}</MonthCaption>
          <TextField
            value={septemberCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setSeptemberCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`October:`}</MonthCaption>
          <TextField
            value={octoberCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setOctoberCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`November:`}</MonthCaption>
          <TextField
            value={novemberCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setNovemberCount(event.target.value);
            }}
          />
        </MonthInput>
        <MonthInput>
          <MonthCaption variant="h6">{`December:`}</MonthCaption>
          <TextField
            value={decemberCount}
            margin="normal"
            style={{ maxWidth: "6rem" }}
            onChange={(event) => {
              setDecemberCount(event.target.value);
            }}
          />
        </MonthInput>
      </MonthInputs>
    </SettingsModalLayout>
  );
};

const LoadingSkeletons: React.FunctionComponent<{}> = () => {
  const NUM_SKELETONS = 20;

  return (
    <>
      {Array.from(Array(NUM_SKELETONS)).map((skeleton) => (
        <Skeleton></Skeleton>
      ))}
    </>
  );
};

const Title = styled(Typography)`
  width: auto;
  padding-right: 2rem;
`;

const TitleAndYear = styled.div`
  grid-area: titleAndYear;
  display: flex;
  align-items: center;
`;

const SettingsModalLayout = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    "titleAndYear saveButton"
    "monthInputs monthInputs";
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
  max-width: 10rem;
  justify-self: flex-end;
`;

const MonthInputs = styled.div`
  grid-area: monthInputs;
  display: flex;
  flex-wrap: wrap;
`;

const MonthInput = styled.div`
  display: flex;
  align-items: center;
  width: 16rem;
`;

const MonthCaption = styled(Typography)`
  padding-right: 2rem;
  width: 8rem;
`;

export default SettingsModal;
