import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography'
import moment from 'moment';
import TimelineDot from '@mui/lab/TimelineDot';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function Goals() {
    const [goals, setGoals] = useState([] as any[]);
    const [goalType, setGoalType] = useState("IN PROGRESS");
    const [expanded, setExpanded] = React.useState('');
   
    const fetchGoals = () => {
      fetch('http://localhost:8000/goals/goal/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include"
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

    const handleChange1 = (panel: any) => (_event: any, isExpanded:any) => {
      setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
        <Typography component="h2" variant="button" sx={{ fontSize: 16 }} color="text.secondary" gutterBottom style={{marginTop:'24px'}}>
            Active Goals
        </Typography>
        <Grid container style={{marginTop:'8px'}}>
            {Object.values(goals).map(data => (
            data.status == goalType ?
                <Accordion key={data.id} expanded={expanded === data.id} onChange={handleChange1(data.id)} style={{width:'100%'}}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography  variant="h6" sx={{ width: '65%', flexShrink: 0 }}>
                      {data.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', margin: '6px'}}>{data.status}</Typography>
                    <TimelineDot color="error" sx={{ backgroundColor: 'red', }}/>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          Goal Review Date
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {moment(data.goal_review_date).format("dddd, MMMM Do YYYY")} <br/>
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          Goal Description
                        </Typography>
                        <Typography variant="body2">
                          {data.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  </AccordionDetails>
                 
                </Accordion> 
               : null
            ))}
          </Grid> 
        </>
    )
}
