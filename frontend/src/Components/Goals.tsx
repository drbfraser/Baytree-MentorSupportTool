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

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);

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
  <Card elevation={1} sx = {{bgcolor: lightGreen[200]}}>
        <CardHeader
          
        />
        <CardContent>
        <Button sx = {{}} variant="contained" color="success" endIcon={<DoneIcon/>}></Button>
          <Typography variant="body2" color="textSecondary">
            
          this is a new goal and needs to be completed asap
          </Typography>
        </CardContent>
      </Card>
      </Grid>
        <GoalsStatistics />
      </Container>
  
    )
}
