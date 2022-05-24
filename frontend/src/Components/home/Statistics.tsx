import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card"
import { FunctionComponent, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { defaultCount, getSessionCount, SessionsCount } from "./stats";

const Count: FunctionComponent<{ title: string, count: number, color?: string }> = (props) => {
  return <Grid item sm={12} md={6} lg={3}>
    <Card sx={{ p: 2, display: "flex", alignItem: "center", justifyContent: "space-between" }}>
      <Typography variant="h6" component="h6" color="text.secondary" sx={{ width: "100px"}}>
        {props.title}
      </Typography>
      <Typography component="p" variant="h2" color={props.color || "primary"} sx={{fontWeight: "bold"}}>
        {props.count}
      </Typography>
    </Card>
  </Grid>
}

export default function Statistics() {
  const { user } = useAuth();
  const [data, setData] = useState<SessionsCount>(defaultCount);

  useEffect(() => {
    getSessionCount(user!.userId)
      .then(data => data && setData(data))
      .then(() => console.log(data))
  }, [])

  return (
    <Grid container spacing={1}>
      <Count title="Sessions Attended" count={data.sessions_attended} />
      <Count title="Missed Sessions" count={data.sessions_missed} color="red" />
      <Count title="Upcoming Sessions" count={data.sessions_remaining} color="blue" />
      <Count title="Pending Reports" count={data.sessions_remaining} color="orange" />
    </Grid>
  );
}
