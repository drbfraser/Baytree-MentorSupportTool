import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import NoteCard from './Notecard';
import GoalsStatistics from './GoalsStatistics';

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
      setTabValue(newValue);
    };

    useEffect(() => {
      fetch('http://localhost:8000/goals/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then (response => response.json())
      .then (data => setGoals(data.data))
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

    console.log(goals);


    return (
      <Container maxWidth = "lg" sx = {{mt: 5}}>
        <Tabs value={tabValue} onChange={handleChange} centered sx = {{mb: 3}}>
            <Tab label="Active" />
            <Tab label="Completed" />
            <Tab label="All" />
        </Tabs>
        <Grid container spacing={3} sx = {{bgcolor: "white", p: 5, mb: 3, ml: 1, boxShadow: 2, borderRadius: 5}} style = {{height: "55vh"}}>
          {goals.map(goals => (
            <Grid item xs={12} md={6} lg={4}>
                <NoteCard />
            </Grid>
          ))}
        </Grid>
        <GoalsStatistics />
      </Container>
    )
}