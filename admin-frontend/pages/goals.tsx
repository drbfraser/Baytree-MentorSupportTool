import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TimelineDot from "@mui/lab/TimelineDot";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { format, formatDistanceToNow } from "date-fns";
import { NextPage } from "next";
import { FunctionComponent, SyntheticEvent, useEffect, useState } from "react";
import { backendGet } from "../api/backend/base";
import Button from "../components/shared/button";

interface Goal {
  id: number;
  mentor?: {
    user: {
      email: string;
    }
  }
  mentee?: {
    firstName: string;
    lastName: string;
  }
  title: string;
  creation_date: string;
  goal_review_date: string;
  last_update_date: string;
  status: "IN PROGRESS" | "RECALIBREATED" | "ACHIEVED";
  description: string;
}

const GoalListItem: FunctionComponent<{ goal: Goal, expanded: boolean, handleExpansion: () => void }> = ({ goal, expanded, handleExpansion }) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "eeee, MMMM do yyyy");
  }

  const mentorEmail = goal.mentor?.user.email || "N/A";
  const menteeName = goal.mentee ? `${goal.mentee.firstName} ${goal.mentee.lastName}` : "N/A";

  return <Accordion
    expanded={expanded}
    onChange={handleExpansion}
    style={{ width: "100%" }}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {goal.title}
        </Typography>
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '8px' }}>
          <Typography
            sx={{
              color: "text.secondary",
              margin: "8px",
              paddingRight: '8px'
            }}
          >
            {formatDistanceToNow(new Date(goal.creation_date), { addSuffix: true })}
          </Typography>
          <Typography sx={{ color: "text.secondary", margin: "6px" }}>
            {goal.status}
          </Typography>
          {goal.status === "IN PROGRESS" ? (
            <TimelineDot color="error" sx={{ backgroundColor: "red", alignSelf: 'center' }} />
          ) : goal.status === "ACHIEVED" ? (
            <TimelineDot color="success" sx={{ backgroundColor: "green", alignSelf: 'center' }} />
          ) : (
            <TimelineDot color="success" sx={{ backgroundColor: "blue", alignSelf: 'center' }} />
          )}
        </div>
      </div>
    </AccordionSummary>
    <AccordionDetails>
      <Stack spacing={1}>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Mentor Email</Typography>
          <Typography variant="body2">{mentorEmail}</Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Created Date</Typography>
          <Typography variant="body2" gutterBottom>{formatDate(goal.creation_date)}</Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Goal Review Date</Typography>
          <Typography variant="body2" gutterBottom>{formatDate(goal.goal_review_date)}</Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Last Update Date</Typography>
          <Typography variant="body2" gutterBottom>{formatDate(goal.last_update_date)}</Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Mentee Name</Typography>
          <Typography variant="body2">{menteeName}</Typography>
        </div>
        <div>
          <Typography sx={{ fontSize: 14, mt: 2 }} color="text.secondary" gutterBottom>Goal Description</Typography>
          <Typography variant="body2">{goal.description}</Typography>
        </div>
      </Stack>
    </AccordionDetails>
  </Accordion>
}

const Goals: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [goals, setGoals] = useState([] as Goal[]);
  const [goalType, setGoalType] = useState<Goal["status"] | "">("");
  const [expanded, setExpanded] = useState<number | undefined>();

  const goalFilter = (goal: Goal) => {
    if (goalType === "") return true;
    return goal.status === goalType;
  }

  useEffect(() => {
    setLoading(true);
    backendGet<Goal[]>("goals/").then(data => {
      if (data) setGoals(data);
    }).catch(_err => {
      setError("Cannot retrive goals")
    }).finally(() => setLoading(false));
  }, []);

  const handleChangeTab = (_event: SyntheticEvent, newValue: Goal["status"] | "") => {
    setGoalType(newValue);
  }

  const exportGoalsToCsv = () => {

  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Tabs
          value={goalType}
          onChange={handleChangeTab}
          centered
        >
          <Tab label="Active" value="IN PROGRESS" />
          <Tab label="Completed" value="ACHIEVED" />
          <Tab label="All" value="" />
        </Tabs>
        <Button
          variant="contained"
          color="success"
          onClick={() => exportGoalsToCsv()}
        >
          Export
        </Button>
      </Box>
      <Box>
        {error && <Alert severity="error">{error}</Alert>}
        {!error && goals.filter(goalFilter).map(goal => {
          const handleExpansion = () => {
            if (goal.id === expanded) setExpanded(undefined);
            else setExpanded(goal.id)
          }

          return <GoalListItem
            key={goal.id}
            goal={goal}
            expanded={expanded === goal.id}
            handleExpansion={handleExpansion} />
        })}
      </Box>
    </>
  );
};

export default Goals;
