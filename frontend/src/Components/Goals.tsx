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
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TimelineDot from "@mui/lab/TimelineDot";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function Goals() {
  const [goals, setGoals] = useState([] as any[]);
  const [goalType, setGoalType] = useState("IN PROGRESS");
  const [tabValue, setTabValue] = useState(0);
  const [expanded, setExpanded] = React.useState("");
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] =
    React.useState(false);
  const [toBeDeletedGoalId, setToBeDeletedGoalId] = useState(null);

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    if (newValue == 0) {
      setGoalType("IN PROGRESS");
    }
    if (newValue == 1) {
      setGoalType("ACHIEVED");
    }
    if (newValue == 2) {
      setGoalType("ALL");
    }
    setTabValue(newValue);
  };

  const handleClickOpenDeleteConfirmationDialog = (goalId: any) => {
    setOpenDeleteConfirmationDialog(true);
    setToBeDeletedGoalId(goalId);
  };

  const handleCloseDeleteConfirmationDialog = () => {
    setOpenDeleteConfirmationDialog(false);
  };

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

  const handleGoalComplete = (goalId: any) => {
    fetch("http://localhost:8000/goals/goal/" + goalId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "ACHIEVED" }),
      credentials: "include"
    }).then((_response) => fetchGoals());
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  console.log(goals);

  const handleChange1 = (panel: any) => (_event: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleGoalDelete = (goalId: any) => {
    fetch("http://localhost:8000/goals/goal/" + goalId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    }).then((_response) => fetchGoals());
  };

  return (
    <Grow in={true}>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={1}></Grid>
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
            <CreateGoals onSubmit={fetchGoals} />
          </Grid>
        </Grid>
        <GoalsStatistics
          activeGoals={
            goals.filter((goal) => goal.status == "IN PROGRESS").length
          }
          completedGoals={
            goals.filter((goal) => goal.status == "ACHIEVED").length
          }
          totalGoals={goals.length}
        />

        <Grid container style={{ marginTop: "24px" }}>
          {Object.values(goals).map((data) =>
            data.status == goalType || goalType == "ALL" ? (
              <Accordion
                expanded={expanded === data.id}
                onChange={handleChange1(data.id)}
                style={{ width: "100%" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography variant="h6" sx={{ width: "35%", flexShrink: 0 }}>
                    {data.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      width: "35%",
                      margin: "6px",
                    }}
                  >
                    {" "}
                    Created on {moment(data.date).format("dddd, MMMM Do YYYY")}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", margin: "6px" }}>
                    {data.status}
                  </Typography>
                  {data.status == "IN PROGRESS" ? (
                    <TimelineDot
                      color="error"
                      sx={{ backgroundColor: "red" }}
                    />
                  ) : data.status == "ACHIEVED" ? (
                    <TimelineDot
                      color="success"
                      sx={{ backgroundColor: "green" }}
                    />
                  ) : (
                    <TimelineDot
                      color="success"
                      sx={{ backgroundColor: "blue" }}
                    />
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Goal Review Date
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {moment(data.goal_review_date).format(
                          "dddd, MMMM Do YYYY"
                        )}{" "}
                        <br />
                      </Typography>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Goal Description
                      </Typography>
                      <Typography variant="body2">{data.content}</Typography>
                    </CardContent>
                  </Card>
                </AccordionDetails>
                <Divider />
                <AccordionActions>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      handleClickOpenDeleteConfirmationDialog(data.id)
                    }
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleGoalComplete(data.id)}
                  >
                    Mark as Completed
                  </Button>
                </AccordionActions>
              </Accordion>
            ) : null
          )}
        </Grid>
        <Dialog
          open={openDeleteConfirmationDialog}
          onClose={handleCloseDeleteConfirmationDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure to delete this goal?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Deleted goal will disapper from the list.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteConfirmationDialog}>
              CANCEL
            </Button>
            <Button
              onClick={() => {
                handleGoalDelete(toBeDeletedGoalId);
                handleCloseDeleteConfirmationDialog();
              }}
              autoFocus
            >
              DELETE
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Grow>
  );
}
