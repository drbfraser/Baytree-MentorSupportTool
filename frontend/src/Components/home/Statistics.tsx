import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { FunctionComponent, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../api/url";

interface SessionsCount {
  sessions_attended: number;
  sessions_missed: number;
  sessions_remaining: number;
  sessions_total: number;
}

const getSessionCount = async (mentorId: number) => {
  const response = await axios.get<{ status: string; data: SessionsCount }>(
    `${API_BASE_URL}/users/statistics/mentor?id=${mentorId}`,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }
  );

  if (response.status === 200 && response.data.status === "success") {
    return response.data.data;
  }
};

const Count: FunctionComponent<{
  title: string;
  count: number;
  color?: string;
}> = (props) => {
  return (
    <Grid item xs={12} sm={6} xl={3}>
      <Card
        sx={{
          p: 2,
          display: "flex",
          alignItem: "center",
          justifyContent: "space-between"
        }}
      >
        <Typography
          variant="h6"
          component="h6"
          color="text.secondary"
          sx={{ width: "100px" }}
        >
          {props.title}
        </Typography>
        <Typography
          component="p"
          variant="h3"
          color={props.color || "primary"}
          sx={{ fontWeight: "bold" }}
        >
          {props.count}
        </Typography>
      </Card>
    </Grid>
  );
};

export default function Statistics() {
  const { user } = useAuth();
  const [data, setData] = useState<SessionsCount>({
    sessions_attended: 0,
    sessions_missed: 0,
    sessions_remaining: 0,
    sessions_total: 0
  });

  useEffect(() => {
    getSessionCount(user!.userId).then((data) => data && setData(data));
  }, []);

  return (
    <Grid container spacing={1}>
      <Count title="Sessions Attended" count={data.sessions_attended} />
      <Count title="Missed Sessions" count={data.sessions_missed} color="red" />
      <Count
        title="Upcoming Sessions"
        count={data.sessions_remaining}
        color="blue"
      />
      <Count
        title="Pending Reports"
        count={data.sessions_remaining}
        color="orange"
      />
    </Grid>
  );
}
