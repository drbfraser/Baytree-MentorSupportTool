import CreateGoals from './CreateGoals'
import Statistics from './Statistics'
import Scheduler from './Scheduler'
import MenteeInfo from './MenteeInfo'


import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

const Home = () => {
  
    return (
      <div>
        <Container maxWidth = "xl" sx = {{pt: 2, mt: 3}}>
          <Grid container spacing = {5}>
            <Grid item xs = {8}>
              <Scheduler />
              <Statistics />
            </Grid>
            <Grid item xs = {4}>
              <MenteeInfo />
              <CreateGoals />
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  };
  
  export default Home;