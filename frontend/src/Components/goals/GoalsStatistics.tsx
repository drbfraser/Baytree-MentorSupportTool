import * as React from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function GoalsStatistics(props: any) {
  return (
    <div>
      <Card sx={{ boxShadow: 2, p: 3 }}>
        <Grid style={{ display: "flex" }}>
          <Grid item xs={4} sx={{ m: 0, p: 0 }}>
            <Typography
              component="h6"
              variant="h6"
              color="text.secondary"
              gutterBottom
            >
              Active
            </Typography>
            <Typography component="p" variant="h2" color="red">
              {props.activeGoals}
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem sx={{ m: 0, p: 0 }} />
          <Grid item xs={4} sx={{ ml: 3, p: 0 }}>
            <Typography
              component="h6"
              variant="h6"
              color="text.secondary"
              gutterBottom
            >
              Completed
            </Typography>
            <Typography component="p" variant="h2" color="green">
              {props.completedGoals}
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={4} sx={{ ml: 3, p: 0 }}>
            <Typography
              component="h6"
              variant="h6"
              color="text.secondary"
              gutterBottom
            >
              Total
            </Typography>
            <Typography component="p" variant="h2" color="blue">
              {props.totalGoals}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
