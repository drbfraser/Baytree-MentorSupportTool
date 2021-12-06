import * as React from 'react';
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';

export default function GoalsStatistics() {
  return (
      <div>
        <Card sx = {{boxShadow: 2, border: 1, borderRadius: 5, p: 3, mb: 22, ml: 4}}>
            <Grid style = {{ display: 'flex'}}>
                <Grid item xs = {4} sx = {{m: 0, p: 0}}>
                    <Typography component="h6" variant="h6" color="text.secondary" gutterBottom>
                        Active
                    </Typography>
                    <Typography component="p" variant="h5">
                        2
                    </Typography>
                </Grid>
                <Divider orientation="vertical" flexItem sx = {{m: 0, p: 0}}/>
                <Grid item xs = {4} sx = {{ml: 3, p: 0}}>
                    <Typography component="h6" variant="h6" color="text.secondary" gutterBottom>
                        Completed 
                    </Typography>
                    <Typography component="p" variant="h5">
                        0
                    </Typography>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs = {4} sx = {{ml: 3, p: 0}}>
                    <Typography component="h6" variant="h6" color="text.secondary" gutterBottom>
                        Total 
                    </Typography>
                    <Typography component="p" variant="h5">
                        2
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    </div>
  );
}