import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { MdArrowRight } from "react-icons/md";
import styled from "styled-components";

const Home: NextPage = () => {
  return (
    <SessionGroupPageLayout>
      <WorkstreamTitle variant="h5"></WorkstreamTitle>
      <SavedUnderTitle variant="h5"></SavedUnderTitle>
      <SessionGroupTitle variant="h5"></SessionGroupTitle>
      <WorkStreamTable></WorkStreamTable>
    </SessionGroupPageLayout>
  );
};

const SessionGroupPageLayout = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-gap: 1rem;

  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "workStreamTitle savedUnderTitle sessionGroupTitle"
    "workStreamTable workStreamTable workStreamTable";
`;

const WorkstreamTitle = styled(Typography)`
  grid-area: workStreamTitle;
`;

const SavedUnderTitle = styled(Typography)`
  grid-area: savedUnderTitle;
`;

const SessionGroupTitle = styled(Typography)`
  grid-area: sessionGroupTitle;
`;

const WorkStreamTable: React.FC<WorkStreamTableProps> = (props) => {
  return (
    <WorkStreamTableContainer>
      {props.workStreamEntries.map((workStreamEntry) => (
        <WorkStreamRow
          sessionGroups={props.sessionGroups}
          workStreamEntry={workStreamEntry}
        ></WorkStreamRow>
      ))}
    </WorkStreamTableContainer>
  );
};

interface WorkStreamTableProps {
  workStreams: WorkStream[];
  sessionGroups: SessionGroup[];
  workStreamEntries: WorkStreamEntry[];
}

interface WorkStream {
  name: string;
  viewsId: number;
}

interface SessionGroup {
  name: string;
  viewsId: number;
}

interface WorkStreamEntry {
  workStream: string;
  currentSessionGroupViewsId: number;
}

const WorkStreamTableContainer = styled.div`
  grid-area: workStreamTable;
`;

const WorkStreamRow: React.FC<WorkStreamRowProps> = (props) => {
  return (
    <WorkStreamRowContainer>
      <WorkStreamLabel variant="h5"></WorkStreamLabel>
      <MdArrowRight></MdArrowRight>
      <SessionGroupSelect
        currentSessionGroupViewsId={
          props.workStreamEntry.currentSessionGroupViewsId
        }
        sessionGroups={props.sessionGroups}
      ></SessionGroupSelect>
    </WorkStreamRowContainer>
  );
};

interface WorkStreamRowProps {
  sessionGroups: SessionGroup[];
  workStreamEntry: WorkStreamEntry;
}

const WorkStreamRowContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-template-areas: "workStreamLabel rightArrow sessionGroupSelect";
`;

const WorkStreamLabel = styled(Typography)`
  grid-area: workStreamLabel;
`;

const SessionGroupSelect: React.FC<SessionGroupSelectProps> = (props) => {
  <FormControl fullWidth>
    <InputLabel id="session-group-select-label">Age</InputLabel>
    <Select
      labelId="session-group-select-label"
      id="session-group-select"
      value={props.currentSessionGroupViewsId}
      label="SessionGroup"
      onChange={handleChange}
    >
      {props.sessionGroups.map((sessionGroup) => (
        <MenuItem value={sessionGroup.viewsId}>{sessionGroup.name}</MenuItem>
      ))}
    </Select>
  </FormControl>;
};

interface SessionGroupSelectProps {
  currentSessionGroupViewsId?: number;
  sessionGroups: SessionGroup[];
}

export default Home;
