// Lazily loading data and export to CSV

import { LoadingButton } from "@mui/lab";
import { useState, useRef, useEffect } from "react";
import { CSVLink } from "react-csv";
import { Goal } from "../../../api/backend/goals";
import DownloadIcon from '@mui/icons-material/Download';
import { backendGet } from "../../../api/backend/base";


const headers = [
  { label: "Mentor Email", key: "email" },
  { label: "Mentee Name", key: "mentee" },
  { label: "Goal Creation Date", key: "creation_date" },
  { label: "Goal Review Date", key: "goal_review_date" },
  { label: "Title", key: "title" },
  { label: "Description", key: "description" },
  { label: "Last Update", key: "last_update_date" },
  { label: "Status", key: "status" },
];

type Row = Record<string, any>;

const goalToRow = (goal: Goal) => {
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
  } as Row;
};


// Lazily load the data and download
// https://github.com/react-csv/react-csv/issues/189
const GoalExportButton = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([] as Row[]);
  const csvInstance = useRef<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await backendGet<Goal[]>("goals");
    if (data) setRows(data.map(goalToRow));
    setLoading(false);
  }

  useEffect(() => {
    if (rows && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.click();
        setRows([]);
      })
    }
  }, [rows]);

  return <div>
    <LoadingButton 
      onClick={loadData} 
      disabled={loading} 
      startIcon={<DownloadIcon />} 
      variant="outlined" 
      loading={loading}
      loadingPosition="start">
      Export
    </LoadingButton>
    {rows.length > 0 && <CSVLink headers={headers} data={rows} filename="goals.csv" ref={csvInstance}/>}
  </div>
};

export default GoalExportButton;