import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FunctionComponent, useEffect, useState } from "react";
import { getSessionCount, userApi } from "../../api/mentorAccount";
import { useAuth } from "../../context/AuthContext";

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
