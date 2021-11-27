import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import NoteCard from './Notecard';
import GoalsStatistics from './GoalsStatistics';
import CreateGoals from './CreateGoals';
import { LabelImportantTwoTone } from '@mui/icons-material';

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

    /*
    const handleDelete = async (id: string) => {
      await fetch('http://localhost:8000/goals' + id, {
        method: 'DELETE'
      })
      const newGoals = goals.filter(goals => goals.id != id)
      setGoals(newGoals)
    }
    */
    return (
      <Container >
        
        <Tabs value={tabValue} onChange={handleChange} centered sx = {{mb: 3}}>
            <CreateGoals />
            <Tab disabled/>
            <Tab disabled/>
            <Tab label="Active" />
            <Tab label="Completed" />
            <Tab label="All" />
            <Tab disabled/>
            <Tab disabled/>
            <Tab disabled/>
            
        </Tabs>
        <Grid container spacing={1} sx = {{bgcolor: "white", p: 5, mb: 3, ml: 1, boxShadow: 2, borderRadius: 5}} style = {{height: "55vh"}}>
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