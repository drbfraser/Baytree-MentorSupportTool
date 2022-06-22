import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { NextPage } from "next";
import { SyntheticEvent, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { backendGet } from "../api/backend/base";
import { Goal } from "../api/backend/goals";
import GoalListItem from "../components/pages/goals/GoalListItem";
import Button from "../components/shared/button";
import OverlaySpinner from "../components/shared/overlaySpinner";
import extractDataFromGoals from "../util/extractDataFromGoals";

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

  const extract = extractDataFromGoals(goals);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Tabs
          value={goalType}
          onChange={handleChangeTab}
          centered
        >
          <Tab label="Active" value="IN PROGRESS" />
          <Tab label="Completed" value="ACHIEVED" />
          <Tab label="All" value="" />
        </Tabs>
        <CSVLink style={{ textDecoration: "none" }} {...extract} filename="goals.csv">
          <Button
            variant="contained"
            color="success"
          >
            Export
          </Button>
        </CSVLink>

      </Box>
      <Box>
        <OverlaySpinner active={loading} />
        {error && <Alert severity="error">{error}</Alert>}
        {!error && goals.filter(goalFilter).map(goal => {
          const handleExpansion = () => (goal.id === expanded) ? setExpanded(undefined) : setExpanded(goal.id);
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
