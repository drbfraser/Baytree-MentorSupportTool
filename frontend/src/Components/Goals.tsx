import React, { useEffect, useState } from 'react'

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography'
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import {lightGreen} from '@mui/material/colors';
import GoalsStatistics from './GoalsStatistics';
import CreateGoals from './CreateGoals';

export default function Goals() {
    const [goals, setGoals] = useState([] as any[]);
    const [goalType, setGoalType] = useState("IN PROGRESS");
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
      if (newValue == 0){
        setGoalType("IN PROGRESS");
      }
      if (newValue == 1){
        setGoalType("ACHIEVED");
      }
      if (newValue == 2){
        setGoalType("ALL");
      }
      setTabValue(newValue);
    };
    
    const fetchGoals = () => {
      fetch('http://localhost:8000/goals/goal/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + localStorage.getItem('token'),
        },
      })
      .then (response => response.json())
      .then (data => setGoals(data))
      .catch((error) => {
        console.error('Error:', error);
      });
    }

    useEffect(() => {
      fetchGoals();
    }, []);

    console.log(goals);

    return (
      <Grow in={true}>
        <Container>
          <Grid container spacing = {1}>
            <Grid item xs = {1}>
            </Grid>
            <Grid item xs = {10}>
              <Tabs value={tabValue} onChange={handleChange} centered sx = {{mb: 3}}> 
                  <Tab label="Active" />
                  <Tab label="Completed" />
                  <Tab label="All" />
              </Tabs>
            </Grid>
            <Grid item xs = {1}>
              <CreateGoals onSubmit={fetchGoals} />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx = {{bgcolor: "white", p: 1, mb: 3, ml: 1, boxShadow: 2, borderRadius: 5, border: 1}} style={{height: '58vh', overflow: 'auto'}}>
            {Object.values(goals).map(data => (
            data.status == goalType || goalType == "ALL"? 
            (<Grid item xs = {4}> 
                <Card variant="outlined" elevation={1} sx = {{bgcolor: lightGreen[50], m: 2, border: 3, borderColor: lightGreen[200]}} style = {{minHeight: '6vh'}}>
                  <CardHeader
                    action={
                      <IconButton aria-label="settings">
                        <CheckBoxIcon />
                      </IconButton>
                    }
                    title= {<Typography variant="body1">{data.title}</Typography>}
                    subheader={<Typography variant="body2" color="text.secondary">{data.date}</Typography>}
                    sx = {{m: 0, pb: 0}}
                  />
                  <CardContent>
                    <Container sx = {{bgcolor: "white", p: 2, m: 0, border: 1, borderColor: lightGreen[200]}} style = {{height: '100px', overflow: 'auto'}}>
                      <Typography variant="body2" color="text.secondary">
                        {data.content}
                      </Typography>
                    </Container>
                  </CardContent>
                </Card>
              </Grid>) : null
            ))}
        </Grid> 
          <GoalsStatistics />
        </Container>
      </Grow>
    )
}
