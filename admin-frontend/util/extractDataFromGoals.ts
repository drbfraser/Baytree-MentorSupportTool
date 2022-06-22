import { Goal } from "../api/backend/goals";

const extractDataFromGoals = (goals: Goal[]) => {
  const headers = [
    { label: "Mentor Email", key: "email" },
    { label: "Mentee Name", key: "mentee" },
    { label: "Goal Creation Date", key: "creation_date" },
    { label: "Goal Review Date", key: "goal_review_date" },
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    { label: "Last Update", key: "last_update_date" },
    { label: "Status", key: "status" },
  ]

  const extractGoal = (goal: Goal) => {
    const {mentor, mentee, creation_date, goal_review_date, title, description, last_update_date, status} = goal;
    return {
      email: mentor?.user.email || "",
      mentee: mentee ? `${mentee.firstName} ${mentee.lastName}` : "",
      creation_date,
      goal_review_date,
      title,
      description,
      last_update_date,
      status
    }
  };

  return {headers, data: goals.map(extractGoal)}
}

export default extractDataFromGoals;