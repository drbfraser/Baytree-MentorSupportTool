import Paper from "@mui/material/Paper";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import styled from "styled-components";

const SessionStatsCard: React.FC<{}> = () => {
  const data = [
    {
      completedSessions: 4000,
      upcomingSessions: 2000,
      pendingSessions: 3000,
      cancelledSessions: 2000
    }
  ];

  return (
    <StyledSessionStatsCard>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid></CartesianGrid>
          <Bar dataKey="completedSessions" name="Completed Sessions" fill="#48825C" />
          <Bar dataKey="upcomingSessions" name="Upcoming Sessions" fill="#4482C8" />
          <Bar dataKey="pendingSessions" name="Pending Sessions" fill="#D06F36" />
          <Bar dataKey="cancelledSessions" name="Cancelled Sessions" fill="#D44C47" />
          <YAxis />
          <Legend formatter={(value, entry, index) => <LegendText>{value}</LegendText>} />
        </BarChart>
      </ResponsiveContainer>
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
