import { Skeleton, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  YAxis,
  XAxis,
  LabelList,
} from "recharts";
import styled from "styled-components";
import { getSessionGroupsFromViews } from "../../../api/backend/views/sessionGroups";
import {
  getSessionsFromViews,
  Session,
} from "../../../api/backend/views/sessions";
import { HELP_MESSAGE, MOBILE_BREAKPOINT } from "../../../constants/constants";
import PaginatedSelect, {
  PaginatedSelectOption,
} from "../../shared/paginatedSelect";

const SessionStatsCard: React.FC<{}> = () => {
  const [sessions, setSessions] = useState([]);

  const [loadingData, setLoadingData] = useState(false);
  const [selectedSessionGroups, setSelectedSessionGroups] = useState<
    PaginatedSelectOption<string>[]
  >([]);
  const [data, setData] = useState<any>([
    {
      completedSessions: 20,
      upcomingSessions: 30,
      pendingSessions: 8,
      cancelledSessions: 10,
    },
  ]);

  const loadSessionGroupOptions = async (search: any, prevOptions: any) => {
    const SESSION_GROUPS_SELECT_PAGE_SIZE = 20;

    const sessionGroups = await getSessionGroupsFromViews(
      SESSION_GROUPS_SELECT_PAGE_SIZE,
      prevOptions.length
    );

    if (sessionGroups && sessionGroups.data) {
      const selectboxOptions = {
        options: sessionGroups.data.map((sessionGroup) => ({
          value: sessionGroup.viewsSessionGroupId,
          label: sessionGroup.name,
        })),
        hasMore:
          prevOptions.length + SESSION_GROUPS_SELECT_PAGE_SIZE <
          sessionGroups.total,
      };

      return selectboxOptions;
    } else {
      toast.error(HELP_MESSAGE);
      return { options: [], hasMore: false };
    }
  };

  const getNumCancelledSessions = (sessions: Session[]) => {
    return sessions.reduce(
      (prevVal, curVal) => prevVal + (curVal.cancelled ? 1 : 0),
      0
    );
  };

  const getNumCompletedSessions = (sessions: Session[]) => {
    return sessions.reduce(
      (prevVal, curVal) => prevVal + (new Date() > curVal.startDate && !curVal.cancelled ? 1 : 0),
      0
    );
  };

  const getNumPendingSessions = (sessions: Session[]) => {
    return sessions.reduce(
      (prevVal, curVal) => prevVal + (new Date() > curVal.startDate && !curVal.cancelled ? 1 : 0),
      0
    );
  };

  const getNumUpcomingSessions = (sessions: Session[]) => {
    return sessions.reduce(
      (prevVal, curVal) => prevVal + (new Date() < curVal.startDate ? 1 : 0),
      0
    );
  };

  const onSessionGroupSelectOptionChange = async (newSessionGroups: any) => {
    const selectedSessionGroups = newSessionGroups as
      | PaginatedSelectOption<string>[];

    setSelectedSessionGroups(selectedSessionGroups);

    if (selectedSessionGroups.length === 0) {
      return;
    }

    setLoadingData(true);

    let sessionDataResponses = [];
    for (const sessionGroup of selectedSessionGroups) {
      const sessionDataResponse = await getSessionsFromViews(
        sessionGroup.value
      );

      if (!sessionDataResponse || !sessionDataResponse.data) {
        setLoadingData(false);
        toast.error(HELP_MESSAGE);
        return;
      }

      sessionDataResponses.push({
        name: sessionGroup.label,
        data: sessionDataResponse.data,
      });
    }

    let completedSessionsForSessionGroups: Record<string, number> = {};
    let upcomingSessionsForSessionGroups: Record<string, number> = {};
    let pendingSessionsForSessionGroups: Record<string, number> = {};
    let cancelledSessionsForSessionGroups: Record<string, number> = {};

    for (const sessionDataResponse of sessionDataResponses) {
      completedSessionsForSessionGroups[sessionDataResponse.name] =
        getNumCompletedSessions(sessionDataResponse.data);
      upcomingSessionsForSessionGroups[sessionDataResponse.name] =
        getNumUpcomingSessions(sessionDataResponse.data);
      pendingSessionsForSessionGroups[sessionDataResponse.name] =
        getNumPendingSessions(sessionDataResponse.data);
      cancelledSessionsForSessionGroups[sessionDataResponse.name] =
        getNumCancelledSessions(sessionDataResponse.data);
    }

    setData([
      {
        name: "Completed",
        ...completedSessionsForSessionGroups,
      },
      {
        name: "Upcoming",
        ...upcomingSessionsForSessionGroups,
      },
      {
        name: "Pending to Report",
        ...pendingSessionsForSessionGroups,
      },
      {
        name: "Cancelled",
        ...cancelledSessionsForSessionGroups,
      },
    ]);

    setLoadingData(false);
  };

  return (
    <>
      <StyledSessionStatsCard>
        <Header
          loadSessionGroupOptions={loadSessionGroupOptions}
          onSessionGroupSelectOptionChange={onSessionGroupSelectOptionChange}
        ></Header>
        <Chart loading={loadingData} selectedSessionGroups={selectedSessionGroups} data={data}></Chart>
      </StyledSessionStatsCard>
      <ToastContainer></ToastContainer>
    </>
  );
};

const StyledSessionStatsCard = styled(Paper)`
  width: 100%;
  height: 100%;
  padding: 2rem 2rem 0rem 0.2rem;
  grid-area: sessionStatsCard;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "header"
    "chart";
`;

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
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <StyledHeader>
      <HeaderTitle variant="h4">Group Statistics</HeaderTitle>
      <PaginatedSelect
        isMulti={true}
        loadOptions={props.loadSessionGroupOptions}
        onChange={props.onSessionGroupSelectOptionChange}
      ></PaginatedSelect>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  grid-area: header;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
  display: flex;

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    display: block;
  }
`;

const HeaderTitle = styled(Typography)`
  white-space: nowrap;
  margin-right: 2rem;

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    white-space: unset;
    margin-right: 0rem;
  }
`;

const Chart: React.FC<{
  data: any;
  loading: boolean;
  selectedSessionGroups: PaginatedSelectOption<string>[];
}> = (props) => {
  const getUniqueColor = (n: number) => {
    const colors = ["#48825C", "#4482C8", "#D06F36", "#D44C47", "#8c44ff", "#fffd92", "#eb6ec1"];
    return colors[n % colors.length];
  };

  return (
    <StyledChart>
      {props.loading ? (
        <div style={{ marginLeft: "2rem" }}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        <ResponsiveContainer width="99%" height={240}>
          <BarChart data={props.data}>
            <CartesianGrid></CartesianGrid>
            {props.selectedSessionGroups.map((selectedSessionGroup, i) => (
              <Bar
                dataKey={selectedSessionGroup.label}
                name={selectedSessionGroup.label}
                fill={getUniqueColor(i)}
              >
                <LabelList
                  dataKey={selectedSessionGroup.label}
                  position="center"
                ></LabelList>
              </Bar>
            ))}
            <XAxis dataKey={"name"}></XAxis>
            <YAxis />
            <Legend
              formatter={(value, entry, payload) => (
                <LegendText>{value}</LegendText>
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </StyledChart>
  );
};

const StyledChart = styled.div`
  grid-area: chart;
`;

const LegendText = styled.span`
  color: #000000;
`;

export default SessionStatsCard;
