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
        fetch(`http://localhost:8000/users/statistics/mentor?id=${localStorage.getItem('user_id')}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include"
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
            <Card sx = {{border: 0.1, boxShadow: 2, borderRadius: 5, p: 3, mt: 4}}>
                <Grid style = {{ display: 'flex'}}>
                    <Grid item xs = {4} sx = {{m: 0, p: 0}}>
                        <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
                            Sessions Attended
                        </Typography>
                        <Typography component="p" variant="h4">
                            {Object.values(statistics).map((data) => data.sessions_attended)}
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                            Last: 7 Nov, 2021
                        </Typography>
                        <div>
                        <Link color="primary" href="#" onClick={preventDefault}>
                            View More
                        </Link>
                        </div>
                    </Grid>
                    <Divider orientation="vertical" flexItem sx = {{m: 0, p: 0}}/>
                    <Grid item xs = {4} sx = {{ml: 3, p: 0}}>
                        <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
                            Missed Sessions
                        </Typography>
                        <Typography component="p" variant="h4">
                            {Object.values(statistics).map((data) => data.sessions_missed)}
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                            Last: 15 Oct, 2021
                        </Typography>
                        <div>
                        <Link color="primary" href="#" onClick={preventDefault}>
                        View More
                        </Link>
                        </div>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs = {4} sx = {{ml: 3, p: 0}}>
                        <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
                            Upcoming Sessions
                        </Typography>
                        <Typography component="p" variant="h4">
                            {Object.values(statistics).map((data) => data.sessions_remaining)}   
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                            Due: 21 Nov, 2021
                        </Typography>
                        <div>
                        <Link color="primary" href="#" onClick={preventDefault}>
                            View More
                        </Link>
                        </div>
                    </Grid>
                </Grid>
            </Card>
        </div>
    );
    }