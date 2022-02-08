import {useState, useEffect} from 'react';
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Statistics() {

    const [statistics, setStatistics] = useState([] as any[]);

    useEffect(() => {
        fetch('http://localhost:8000/users/statistics/mentor/1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('token'),
          },
        })
        .then (response => response.json())
        .then (data => setStatistics(data))
        .catch((error) => {
          console.error('Error:', error);
        });
      }, []);

    console.log(statistics);

    return (
        <div>   
        <Card sx = {{boxShadow: 2, p: 3, mt: 1 }}>
            <Grid style = {{ display: 'flex'}}>
                <Grid item xs = {3} sx = {{m: 0, p: 0}}>
                    <Typography component="h6" variant="h6" color="text.secondary" gutterBottom>
                        Sessions Attended
                    </Typography>
                    <Typography component="p" variant="h2" color="red">
                    {Object.values(statistics).map((data) => data.sessions_attended)}
                    </Typography>
                </Grid>
                <Divider orientation="vertical" flexItem sx = {{m: 0, p: 0}}/>
                <Grid item xs = {3} sx = {{ml: 3, p: 0}}>
                    <Typography component="h6" variant="h6" color="text.secondary" gutterBottom>
                        Missed Sessions
                    </Typography>
                    <Typography component="p" variant="h2" color="green">
                        {Object.values(statistics).map((data) => data.sessions_missed)}
                    </Typography>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs = {3} sx = {{ml: 3, p: 0}}>
                    <Typography component="h6" variant="h6" color="text.secondary" gutterBottom>
                        Upcoming Sessions 
                    </Typography>
                    <Typography component="p" variant="h2"color="blue" >
                        {Object.values(statistics).map((data) => data.sessions_remaining)} 
                    </Typography>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs = {3} sx = {{ml: 3, p: 0}}>
                    <Typography component="h6" variant="h6" color="text.secondary" gutterBottom>
                        Pending Reports
                    </Typography>
                    <Typography component="p" variant="h2"color="orange" >
                        {Object.values(statistics).map((data) => data.sessions_remaining)} 
                    </Typography>
                </Grid>
            </Grid>
        </Card>
        </div>
        
    );
    }