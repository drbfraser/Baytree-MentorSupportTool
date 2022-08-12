import { Accordion, AccordionDetails, AccordionSummary, Container, Grid, Grow } from "@mui/material";
import Typography from "@mui/material/Typography";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  fetchNotificationsByUserId,
  readNotification
} from "../api/notification";
import { useAuth } from "../context/AuthContext";

export default function Notifications() {
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
      readNotification(+notificationId).then(() =>
        setReadToggle((toggle) => !toggle)
      );
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
                expandIcon={<MdExpandMore />}
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
                  {formatDistanceToNow(new Date(data.creation_date), { addSuffix: true })}
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
