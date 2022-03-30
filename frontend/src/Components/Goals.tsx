import React, { useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import GoalsStatistics from "./GoalsStatistics";
import CreateGoals from "./CreateGoals";
import Divider from "@mui/material/Divider";
import AccordionActions from "@mui/material/AccordionActions";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import moment from "moment";
import TimelineDot from "@mui/lab/TimelineDot";
import { API_BASE_URL } from "../api/url";

export default function Goals() {
  const [goals, setGoals] = useState([] as any[]);
  const [goalType, setGoalType] = useState("IN PROGRESS");
  const [tabValue, setTabValue] = useState(0);
  const [expanded, setExpanded] = React.useState("");
  const [menteeList, setMenteeList] = useState([] as any[]);
  const [toBeUpdatedGoalId, setToBeUpdatedGoalId] = useState(undefined);

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    if (newValue === 0) {
      setGoalType("IN PROGRESS");
    }
    if (newValue === 1) {
      setGoalType("ACHIEVED");
    }
    if (newValue === 2) {
      setGoalType("ALL");
    }
    setTabValue(newValue);
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

  const fetchMenteeList = () => {
    fetch(`${API_BASE_URL}/users/mentors?id=${localStorage.getItem('user_id')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include"
    })
    .then (response => response.json())
    .then (data => setMenteeList(data.data.menteeuser || []))
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  useEffect(() => {
    fetchGoals();
    fetchMenteeList();
  }, []);

  const handleSubmitCreateGoal = () => {
    setToBeUpdatedGoalId(undefined);
    fetchGoals();
  };

  const handleGoalComplete = (goalId: any) => {
    fetch(`${API_BASE_URL}/goals/goal/${goalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "ACHIEVED" }),
      credentials: "include"
    }).then((_response) => fetchGoals());
  };

  const handleChange1 = (panel: any) => (_event: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);
  };

  const toBeUpdatedGoal = toBeUpdatedGoalId && goals ? goals.find(g => g.id === toBeUpdatedGoalId) : undefined;

  const handleCSV = () => {
    const mentorName = (localStorage.getItem('firstname') || '') + ' ' + (localStorage.getItem('lastname') || '')
    let csvContent = "data:text/csv;charset=utf-8," 
    csvContent+= "Mentor Name, Mentee Name, Goal Creation Date, Goal Review Date, Title, Description, Update Date, Status \n"
    
    for(var i = 0; i < goals.length; i++){
      csvContent+= '"' + mentorName + '","' +  goals[i].mentee + '","' + goals[i].date + '","' + goals[i].goal_review_date + '","' +
        goals[i].title.replaceAll('"', '""') + '","' + goals[i].content.replaceAll('"', '""')  + '","'+ goals[i].last_update_date + '","' + 
        goals[i].status + '"\n'
    }

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Goals.csv");
    document.body.appendChild(link);
    link.click(); 
  }

  return (
    <Grow in={true}>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={1}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleCSV()}
            >
              Export
            </Button>
          </Grid>
          <Grid item xs={10}>
            
            <Tabs
              value={tabValue}
              onChange={handleChange}
              centered
              sx={{ mb: 3 }}
            >
              <Tab label="Active" />
              <Tab label="Completed" />
              <Tab label="All" />
            </Tabs>
          </Grid>
          <Grid item xs={1}>
            <CreateGoals menteeList={menteeList} onSubmit={handleSubmitCreateGoal} />
          </Grid>
        </Grid>
        <GoalsStatistics
          activeGoals={
            goals.filter((goal) => goal.status === "IN PROGRESS").length
          }
          completedGoals={
            goals.filter((goal) => goal.status === "ACHIEVED").length
          }
          totalGoals={goals.length}
        />

        {toBeUpdatedGoal && 
          <CreateGoals 
              goal={toBeUpdatedGoal}
              goalId={toBeUpdatedGoalId}
              menteeList={menteeList}
              onSubmit={handleSubmitCreateGoal}
              onClose={() => setToBeUpdatedGoalId(undefined)} />
        }

        <Grid container style={{ marginTop: "24px" }}>
          {Object.values(goals).map((data) =>
            data.status === goalType || goalType === "ALL" ? (
              <Accordion 
                key={data.id}
                expanded={expanded === data.id}
                onChange={handleChange1(data.id)}
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
                {data.status === "IN PROGRESS" && 
                  <>
                    <Divider />
                    <AccordionActions>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setToBeUpdatedGoalId(data.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<DoneIcon />}
                        onClick={() => handleGoalComplete(data.id)}
                      >
                        Complete
                      </Button>
                    </AccordionActions>
                  </>
                }
              </Accordion>
            ) : null
          )}
        </Grid>
      </Container>
    </Grow>
  );
}
