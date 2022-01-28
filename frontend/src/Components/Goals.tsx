import React, { useEffect, useState } from 'react'

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography'
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import {lightGreen} from '@mui/material/colors';
import GoalsStatistics from './GoalsStatistics';
import CreateGoals from './CreateGoals';
import Divider from '@mui/material/Divider';
import AccordionActions from '@mui/material/AccordionActions';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';

export default function Goals() {
    const [goals, setGoals] = useState([] as any[]);
    const [goalType, setGoalType] = useState("IN PROGRESS");
    const [tabValue, setTabValue] = useState(0);
    const [expanded, setExpanded] = React.useState('');

    const handleChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
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

    const handleGoalComplete = (goalId: any) => {
      fetch('http://localhost:8000/goals/goal/'+ goalId , {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({status:"ACHIEVED"})
      })
      .then(_response => fetchGoals());
    }

    useEffect(() => {
      fetchGoals();
    }, []);

    console.log(goals); 

    const handleChange1 = (panel: any) => (_event: any, isExpanded:any) => {
      setExpanded(isExpanded ? panel : false);
    };

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
          <GoalsStatistics 
            activeGoals={goals.filter( (goal) => goal.status == "IN PROGRESS").length}
            completedGoals={goals.filter( (goal) => goal.status == "ACHIEVED").length}
            totalGoals={goals.length} />

          <Grid container style={{marginTop:'24px'}}>
            {Object.values(goals).map(data => (
            data.status == goalType || goalType == "ALL"? 
                <Accordion expanded={expanded === data.id} onChange={handleChange1(data.id)} style={{width:'100%'}}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography sx={{ width: '35%', flexShrink: 0 }}>
                      {data.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', width: '35%'}}>{moment(data.date).format("dddd, MMMM Do YYYY")}</Typography>
                    <Typography sx={{ color: 'text.secondary'}}>{data.status}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Goal Deadline: {moment(data.goal_review_date).format("dddd, MMMM Do YYYY")} <br/>
                      Details: <br/>
                      {data.content}
                      Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                      Aliquam eget maximus est, id dignissim quam.
                    </Typography>
                   
                  </AccordionDetails>
                  <Divider />
                  <AccordionActions>
                  <Button variant="outlined" startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                    <Button variant="contained" color="success" onClick={() => handleGoalComplete(data.id)}>
                      Mark as Completed
                    </Button>
                  </AccordionActions>
                  
                </Accordion> 
               : null
            ))}
        </Grid> 
        </Container>
      </Grow>
    )
}
