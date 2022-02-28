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
} from "recharts";
import styled from "styled-components";
import {
  getSessionGroupsFromViews,
} from "../../../api/backend/views/sessionGroups";
import { HELP_MESSAGE } from "../../../constants/constants";
import PaginatedSelect, {
  PaginatedSelectOption,
} from "../../shared/paginatedSelect";

const SessionStatsCard: React.FC<{}> = () => {
  const [sessions, setSessions] = useState([]);

  const [data, setData] = useState([
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

  const loadSessionData = (viewsSessionGroupId: string) => {
  };

  return (
    <StyledSessionStatsCard>
      <PaginatedSelect
        isMulti={true}
        loadOptions={loadSessionGroupOptions}
        onChange={(newValue) => {
          const selectedSessionGroup =
            newValue as PaginatedSelectOption<string>;
          loadSessionData(selectedSessionGroup.value);
        }}
      ></PaginatedSelect>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid></CartesianGrid>
          <Bar
            dataKey="completedSessions"
            name="Completed Sessions"
            fill="#48825C"
          />
          <Bar
            dataKey="upcomingSessions"
            name="Upcoming Sessions"
            fill="#4482C8"
          />
          <Bar
            dataKey="pendingSessions"
            name="Pending Sessions"
            fill="#D06F36"
          />
          <Bar
            dataKey="cancelledSessions"
            name="Cancelled Sessions"
            fill="#D44C47"
          />
          <YAxis />
          <Legend formatter={(value) => <LegendText>{value}</LegendText>} />
        </BarChart>
      </ResponsiveContainer>
      <ToastContainer></ToastContainer>
    </StyledSessionStatsCard>
  );
};

const StyledSessionStatsCard = styled(Paper)`
  width: 100%;
  height: 100%;
  padding: 2rem 2rem 1.5rem 2rem;
  grid-area: sessionStatsCard;
`;

const LegendText = styled.span`
  color: #000000;
`;

export default SessionStatsCard;
