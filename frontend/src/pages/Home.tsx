import ActiveGoalsSummary from '@components/home/ActiveGoalsSummary'
import MenteeInfo from '@components/home/MenteeInfo'
import Scheduler from '@components/home/Scheduler'
import Statistics from '@components/home/Statistics'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

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
  )
}

export default Home
