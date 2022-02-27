import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionActions from "@mui/material/AccordionActions";
import Button from "@mui/material/Button";
import Dashboard from "./Dashboard";
import Questionnaire from "./Questionnaire";

export default function Notification() {
  const [notifications, setNotifications] = useState([] as any[]);
  const [expanded, setExpanded] = React.useState("");

  const fetchNotifications = () => {
    fetch(`http://localhost:8000/notifications/${localStorage.getItem('user_id')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include"
    })
    .then (response => response.json())
    .then (data => setNotifications(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  console.log(notifications)
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationComplete = (notificationId: any) => {
    fetch("http://localhost:8000/notifications/" + notificationId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({is_read: true }),
      credentials: "include"
    }).then((_response) => fetchNotifications());
  };

  const handleChange1 = (panel: any) => (_event: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grow in={true}>
      <Container>
        <Grid container style={{ marginTop: "24px" }}>
          {Object.values(notifications).map((data) =>
              <Accordion 
                key={data.id}
                expanded={expanded === data.id}
                onChange={handleChange1(data.id)}
                style={{ width: "100%", backgroundColor: data.is_read ? "#fff8" : "#fff" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography variant="h6" sx={{ 
                    width: "75%", 
                    flexShrink: 0,
                    fontWeight: data.is_read ? 500 : 600, 
                    color: data.is_read ? "rgba(0,0,0,0.6)" : "rgb(0,0,0)"  }}>
                    {data.notification_type.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", margin: "6px" }}>
                    {data.is_read ? "COMPLETED" : "NOT COMPLETED"}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Link to = "/dashboard/Questionnaires">
                        <Typography
                            color="text.secondary"
                            gutterBottom
                        >
                            {data.notification_type.content}
                        </Typography>
                    </Link>
                </AccordionDetails>
                    {!data.is_read &&
                        <AccordionActions>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleNotificationComplete(data.id)}
                            >
                                Mark as Completed
                            </Button>
                        </AccordionActions>
                    }
              </Accordion>
          )}
        </Grid>
      </Container>
    </Grow>
  );
}
