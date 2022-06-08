import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";

const GoalStatisticsCell: FunctionComponent<{ title: string, count: number, color?: string }> = (props) => {
  return <Grid item xs={12} sm={4}>
    <Card sx={{ boxShadow: 2, p: 3 }}>
      <Typography
        component="h6"
        variant="h6"
        color="text.secondary"
        gutterBottom
      >
        {props.title.toUpperCase()}
      </Typography>
      <Typography component="p" variant="h2" color={props.color || "primary"}>
        {props.count}
      </Typography>
    </Card>
  </Grid>
};

export default function GoalsStatistics() {
  return (
    <Grid container spacing={2}>
      <GoalStatisticsCell title="Active" count={0} color="secondary" />
      <GoalStatisticsCell title="Completed" count={0} />
      <GoalStatisticsCell title="All" count={0} color="blue" />
    </Grid>
  );
}
