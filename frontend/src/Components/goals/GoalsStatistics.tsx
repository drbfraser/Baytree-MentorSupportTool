import { CardActionArea, CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useGoals, DEFAULT_PAGINATION } from "../../context/GoalContext";

type GoalStatisticsCellType = {
  active?: boolean;
  title: string;
  count: number;
  color?: string;
  activeColor?: string;
  action?: () => void;
}

const GoalStatisticsCell: FunctionComponent<GoalStatisticsCellType> = (props) => {
  const {loadingStatistics} = useGoals();
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
            <strong>{loadingStatistics ? "-" : props.count}</strong>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
};

const GoalsStatistics = () => {
  const {statistics: {active, complete}, params, handleChangeParams} = useGoals();
  return (
    <Grid container spacing={2}>
      <GoalStatisticsCell
        title="All"
        count={active + complete}
        color="blue"
        activeColor="rgba(0, 0, 255, 0.2)"
        active={!params.active && !params.completed}
        action={() => handleChangeParams({...DEFAULT_PAGINATION})} />
      <GoalStatisticsCell
        title="Active"
        count={active}
        color="secondary"
        active={params.active}
        activeColor="rgba(255, 30, 137, 0.2)"
        action={() => handleChangeParams({...DEFAULT_PAGINATION, active: true})} />
      <GoalStatisticsCell
        title="Completed"
        count={complete}
        active={params.completed}
        action={() => handleChangeParams({...DEFAULT_PAGINATION, completed: true})} />
    </Grid>
  );
}

export default GoalsStatistics;
