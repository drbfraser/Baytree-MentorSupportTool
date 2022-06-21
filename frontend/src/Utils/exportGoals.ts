import { Goal } from "../api/goals";
import { User } from "../api/views";

const exportGoals = (goals: Goal[], mentor: User) => {
  const headers = [
    { label: "Mentor Name", key: "mentor" },
    { label: "Mentee Name", key: "mentee" },
    { label: "Goal Creation Date", key: "creation_date" },
    { label: "Goal Review Date", key: "goal_review_date" },
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    { label: "Last Update", key: "last_update_date" },
    { label: "Status", key: "status" },
  ]

  const mentorName = `${mentor.firstname} ${mentor.surname}`;

  const data = goals.map(({mentee, creation_date, goal_review_date, title, description, last_update_date, status}) => ({
    mentor: mentorName,
    mentee: `${mentee.firstName} ${mentee.lastName}`,
    creation_date,
    goal_review_date,
    title,
    description,
    last_update_date,
    status
  }));

  return {headers, data}
};

export default exportGoals;