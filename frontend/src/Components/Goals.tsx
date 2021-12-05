import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography'
import DoneIcon from '@mui/icons-material/DoneOutline';
import Button from '@mui/material/Button';
import { positions } from '@mui/system';

import {lightGreen} from '@mui/material/colors';

import NoteCard from './Notecard';
import GoalsStatistics from './GoalsStatistics';
import { getJSDocClassTag } from 'typescript';
import { AlignHorizontalLeft } from '@mui/icons-material';
import CreateGoals from './CreateGoals';
import { LabelImportantTwoTone } from '@mui/icons-material';
import Fab from '@mui/material/Fab';

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);
    const [goalList, setGoalList] = useState([] as any[]);

    const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
      setTabValue(newValue);
    };

    useEffect(() => {
      fetch('http://localhost:8000/goals/goal/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then (response => response.json())
      .then (data => setGoalList(data.data))
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

    console.log(goals);


    return (
      <Container >
        
        <Tabs value={tabValue} onChange={handleChange} centered sx = {{mb: 3}}> 
            <Tab label="Active" />
            <Tab label="Completed" />
            <Tab label="All" />
            
        </Tabs>
        <Grid sx = {{ position: 'absolute', top: 110, right: 55,}}><CreateGoals /></Grid>

        <Grid container spacing={0} sx = {{bgcolor: "white", p: 5, mb: 3, ml: 1, boxShadow: 2, borderRadius: 5}} style = {{height: "58vh"}}>
       
        {goals.map(goals => (
            <Grid item xs={12} md={6} lg={4}>
                <NoteCard />
            </Grid>
          ))}
           <Card elevation={3} sx = {{bgcolor: lightGreen[200], m: 2, mb: 2}}>
        <CardContent>
        <Typography variant="body2" color="textSecondary">
          <ul> <h3>Title: </h3> New Goal</ul>
          <ul> <h3>Date: </h3> 11/14/2021</ul>
          <ul> <h3>Goal Review Date: </h3> 11/14/2021 </ul>
          <ul> <h3>Contents: </h3> This is a Test Goal.</ul>


          </Typography>
        <Fab sx = {{color: 'green'}} size="small" aria-label="add" >
        <DoneIcon/>
        </Fab>
        </CardContent>
      </Card>

      <Card elevation={3} sx = {{bgcolor: lightGreen[200], m: 2, mb: 2}}>
        <CardContent>
        <Typography variant="body2" color="textSecondary">
          <ul> <h3>Title: </h3> Goal</ul>
          <ul> <h3>Date: </h3> 12/12/2021</ul>
          <ul> <h3>Goal Review Date: </h3> 12/25/2021 </ul>
          <ul> <h3>Contents: </h3> Complete English module 1.</ul>


          </Typography>
        <Fab sx = {{color: 'green'}} size="small" aria-label="add" >
        <DoneIcon/>
        </Fab>
        </CardContent>
      </Card>


      
        </Grid>
       
        <GoalsStatistics />
      </Container>
  
    )
}
