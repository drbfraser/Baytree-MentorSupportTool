import { Accordion, AccordionDetails, AccordionSummary , Grid, Paper, Typography } from "@mui/material";
import { NextPage } from "next";
import Container from "@mui/material/Container";
import Grow from "@mui/material/Grow";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TimelineDot from "@mui/lab/TimelineDot";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/shared/button";
import { API_BASE_URL } from "../api/backend/url";
import moment from "moment";

const Goals: NextPage = () => {
 
    const [goals, setGoals] = useState([] as any[]);
    const [goalType, setGoalType] = useState<"IN PROGRESS" | "ACHIEVED" | "ALL">("IN PROGRESS");
    const [tabValue, setTabValue] = useState(0);
    const [expanded, setExpanded] = React.useState('');

    const handleGoalTypeChange = (
        _event: React.SyntheticEvent<Element, Event>,
        newGoalType: number
      ) => {
        if (newGoalType === 0) {
          setGoalType("IN PROGRESS");
        }
        if (newGoalType === 1) {
          setGoalType("ACHIEVED");
        }
        if (newGoalType === 2) {
          setGoalType("ALL");
        }
        setTabValue(newGoalType);
      };

    const fetchGoals = () => {
        fetch(`${API_BASE_URL}/goals/goal/`, {
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
  
    const handleChangeExpandedGoal = (panel: any) => (_event: any, isExpanded:any) => {
        setExpanded(isExpanded ? panel : false);
    };
   
    const exportGoalsToCsv = () => {
        const mentorName = (localStorage.getItem('firstname') || '') + ' ' + (localStorage.getItem('lastname') || '')
        let csvContent = "data:text/csv;charset=utf-8," 
        csvContent+= "Mentor Name, Mentee Name, Goal Creation Date, Goal Review Date, Title, Description, Update Date, Status \n"
        
        for(var i = 0; i < goals.length; i++){
          csvContent+= '"' + goals[i].mentor.email + '","' +  goals[i].mentee + '","' + goals[i].date + '","' + goals[i].goal_review_date + '","' +
            goals[i].title.replaceAll('"', '""') + '","' + goals[i].content.replaceAll('"', '""')  + '","'+ goals[i].last_update_date + '","' + 
            goals[i].status + '"\n'
        }
    
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Goals.csv");
        document.body.appendChild(link);
    
        link.click(); 
        document.body.removeChild(link);
    }

    return (
        <Grow in={true}>
          <Container>
            <Grid container spacing={1}>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => exportGoalsToCsv()}
                >
                  Export
                </Button>
              </Grid>
              <Grid item xs={10}>
                
                <Tabs
                  value={tabValue}
                  onChange={handleGoalTypeChange}
                  centered
                  sx={{ mb: 3 }}
                >
                  <Tab label="Active" />
                  <Tab label="Completed" />
                  <Tab label="All" />
                </Tabs>
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: "24px" }}>
              {Object.values(goals).map((data) =>
                data.status === goalType || goalType === "ALL" ? (
                  <Accordion 
                    key={data.id}
                    expanded={expanded === data.id}
                    onChange={handleChangeExpandedGoal(data.id)}
                    style={{ width: "100%" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <Typography variant="h6">
                          {data.title}
                        </Typography>
                        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '8px'}}>
                          <Typography
                            sx={{
                              color: "text.secondary",
                              margin: "8px",
                              paddingRight: '8px'
                            }}
                          >
                            {moment(data.date).fromNow()}
                          </Typography>
                          <Typography sx={{ color: "text.secondary", margin: "6px" }}>
                            {data.status}
                          </Typography>
                          {data.status === "IN PROGRESS" ? (
                            <TimelineDot color="error" sx={{ backgroundColor: "red", alignSelf: 'center' }} />
                          ) : data.status === "ACHIEVED" ? (
                            <TimelineDot color="success" sx={{ backgroundColor: "green", alignSelf: 'center'  }} />
                          ) : (
                            <TimelineDot color="success" sx={{ backgroundColor: "blue", alignSelf: 'center'  }} />
                          )}
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Mentor Email</Typography>
                      <Typography variant="body2">{data.mentor.email}</Typography>

                      <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Created Date</Typography>
                      <Typography variant="body2" gutterBottom>
                        {moment(data.date).format("dddd, MMMM Do YYYY")} <br />
                      </Typography>
    
                      <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Goal Review Date</Typography>
                      <Typography variant="body2" gutterBottom>
                        {moment(data.goal_review_date).format("dddd, MMMM Do YYYY")} <br />
                      </Typography>
    
                      <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Last Update Date</Typography>
                      <Typography variant="body2" gutterBottom>
                        {moment(data.last_update_date).format("dddd, MMMM Do YYYY")}<br />
                      </Typography>
    
                      <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Mentee Name</Typography>
                      <Typography variant="body2">{data.menteeName}</Typography>
    
                      <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Goal Description</Typography>
                      <Typography variant="body2">{data.content}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ) : null
              )}
            </Grid>
          </Container>
        </Grow>
    );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default Goals;
