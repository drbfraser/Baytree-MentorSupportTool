import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import GoalList from "../Components/goals/GoalsList";
import ActiveGoalsSummary from "../Components/home/ActiveGoalsSummary";
import MenteeInfo from "../Components/home/MenteeInfo";
import Scheduler from "../Components/home/Scheduler";
import Statistics from "../Components/home/Statistics";

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
