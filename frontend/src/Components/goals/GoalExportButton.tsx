import DownloadIcon from '@mui/icons-material/Download';
import { LoadingButton } from '@mui/lab';
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import { fetchAllGoals, Goal } from "../../api/goals";
import useMentor from "../../hooks/useMentor";

const headers = [
  { label: "Mentor Name", key: "mentor" },
  { label: "Mentee Name", key: "mentee" },
  { label: "Goal Creation Date", key: "creation_date" },
  { label: "Goal Review Date", key: "goal_review_date" },
  { label: "Title", key: "title" },
  { label: "Description", key: "description" },
  { label: "Last Update", key: "last_update_date" },
  { label: "Status", key: "status" },
];

type Row = {
  [key: string]: any;
}

// Lazily loading data and export to CSV
// https://github.com/react-csv/react-csv/issues/189
const GoalExportButton = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([] as Row[]);
  const csvInstance = useRef<any | null>(null);
  const { loadingMentor, mentor } = useMentor();

  const goalToRow = (goal: Goal) => {
    const { mentee, creation_date, goal_review_date, title, description, last_update_date, status } = goal;
    return {
      mentor: `${mentor.firstname} ${mentor.surname}`,
      mentee: mentee ? `${mentee.firstName} ${mentee.lastName}` : "",
      creation_date,
      goal_review_date,
      title,
      description,
      last_update_date,
      status
    } as Row;
  }

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await fetchAllGoals();
    if (error || !data)
      toast.error(error);
    else
      setRows(data.map(goalToRow));
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

  return <>
    <LoadingButton 
      onClick={loadData} 
      disabled={loadingMentor || loading} 
      startIcon={<DownloadIcon />} 
      variant="outlined" 
      loading={loading}
      loadingPosition="start">
      Export
    </LoadingButton>
    {rows.length > 0 && <CSVLink headers={headers} data={rows} filename="goals.csv" ref={csvInstance}/>}
  </>
};

export default GoalExportButton;