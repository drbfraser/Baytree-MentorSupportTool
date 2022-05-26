import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchNotificationsByUserId, readNotification } from "../api/notification";
import { useAuth } from "../context/AuthContext";


export default function Notification() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([] as any[]);
  const [expanded, setExpanded] = useState("");

  // Toggle when a notification is read
  const [readToggle, setReadToggle] = useState(false);

  // Refetch the data when a read toggle change
  useEffect(() => {
    fetchNotificationsByUserId(user!.userId)
      .then(setNotifications)
      .catch((error) => console.error("Error:", error));
  }, [readToggle]);

  const handleNotificationComplete = (notificationId: any) => {
    if (!notifications.find((n) => n.id === notificationId).is_read) {
      readNotification(+notificationId)
        .then(() => setReadToggle((toggle) => !toggle));
    }
  };

  const handleChange1 = (panel: any) => (_event: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);

    if (isExpanded) {
      handleNotificationComplete(panel);
    }
  };

  return (
    <Grow in={true}>
      <Container>
        <Grid container style={{ marginTop: "24px" }}>
          {Object.values(notifications).map((data) => (
            <Accordion
              key={data.id}
              expanded={expanded === data.id}
              onChange={handleChange1(data.id)}
              style={{
                width: "100%",
                backgroundColor: data.is_read ? "#fff8" : "#fff"
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography
                  variant="h6"
                  sx={{
                    width: "75%",
                    flexShrink: 0,
                    fontWeight: data.is_read ? 500 : 600,
                    color: data.is_read ? "rgba(0,0,0,0.6)" : "rgb(0,0,0)"
                  }}
                >
                  {data.notification_type.title}
                </Typography>
                <Typography sx={{ color: "text.secondary", margin: "6px" }}>
                  {moment(data.creation_date).fromNow()}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Link to="/dashboard/Questionnaires">
                  <Typography color="text.secondary" gutterBottom>
                    {data.content}
                  </Typography>
                </Link>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Container>
    </Grow>
  );
}
