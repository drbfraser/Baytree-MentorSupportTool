import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import GoalList from "../goals/GoalsList";
import ActiveGoalsSummary from "./ActiveGoalsSummary";
import MenteeInfo from "./MenteeInfo";
import Scheduler from "./Scheduler";
import Statistics from "./Statistics";

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={12} lg={8}>
          <Scheduler />
          <Statistics />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={4}>
          <MenteeInfo />
          <ActiveGoalsSummary />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
