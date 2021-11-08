import Statistics from './Statistics'
import MenteeInfo from './MenteeInfo'

import Grid from '@mui/material/Grid'

const Home = () => {
  
    return (
      <div>
        <Grid container spacing = {5}>
          <Grid item xs = {8}>
            <Statistics />
          </Grid>
          <Grid item xs = {4}>
            <MenteeInfo />
          </Grid>
        </Grid>
      </div>
    )
  };
  
  export default Home;