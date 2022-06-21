import { CardActionArea, CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import {Goal} from "../../api/goals";

type Status = Goal["status"];

type GoalStatisticsCellType = {
  active?: boolean;
  title: string;
  count: number;
  color?: string;
  activeColor?: string;
  action?: () => void;
}

const GoalStatisticsCell: FunctionComponent<GoalStatisticsCellType> = (props) => {
  const activeColor = props.activeColor || "rgba(90, 176, 49, 0.2)";
  const bgColor = props.active ? activeColor : undefined;

  return <Grid item xs={12} sm={4}>
    <Card sx={{ boxShadow: 2, backgroundColor: bgColor }}>
      <CardActionArea onClick={props.action}>
        <CardContent>
          <Typography
            component="h6"
            variant="h6"
            color="text.secondary"
            gutterBottom
          >
            {props.title.toUpperCase()}
          </Typography>
          <Typography component="p" variant="h2" color={props.color || "primary"}>
            <strong>{props.count}</strong>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
};

type GoalsStats = {
  selected?: Status;
  handleStatus: (status?: Status) => void;
  active: number;
  completed: number;
  all: number;
}

const GoalsStatistics: FunctionComponent<GoalsStats> = (props) => {
  const {active, completed, all, selected, handleStatus} = props;
  return (
    <Grid container spacing={2}>
      <GoalStatisticsCell 
        title="All" 
        count={all} 
        color="blue"
        activeColor="rgba(0, 0, 255, 0.2)"
        active={!selected}
        action={() => handleStatus()} />
      <GoalStatisticsCell 
        title="Active" 
        count={active} 
        color="secondary"
        active={selected === "IN PROGRESS"}
        activeColor="rgba(255, 30, 137, 0.2)"
        action={() => handleStatus("IN PROGRESS")}
         />
      <GoalStatisticsCell 
        title="Completed" 
        count={completed}
        active={selected === "ACHIEVED"}
        action={() => handleStatus("ACHIEVED")} />
    </Grid>
  );
}

export default GoalsStatistics;
