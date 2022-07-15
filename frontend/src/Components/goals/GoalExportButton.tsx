import DownloadIcon from '@mui/icons-material/Download';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Goal, goalsApi } from "../../api/goals";
import useMentor from "../../hooks/useMentor";
import { unparse } from "papaparse";
import {formatInTimeZone} from "date-fns-tz";
import { TIMEZONE_ID } from '../../Utils/locale';

const goal2CSVRow = (goal: Goal) => ({
  "Mentee Name": goal.mentee ? `${goal.mentee.firstName} ${goal.mentee.lastName}` : "",
  "Goal Creation Date": formatInTimeZone(goal.creation_date, TIMEZONE_ID, "yyyy-MM-dd"),
  "Goal Review Date": formatInTimeZone(goal.goal_review_date, TIMEZONE_ID, "yyyy-MM-dd"),
  "Last Update": formatInTimeZone(goal.last_update_date, TIMEZONE_ID, "yyyy-MM-dd"),
  "Title": goal.title,
  "Description": goal.description,
  "Status": goal.status,
  "Categories": goal.categories.map(c => c.name).join(", ")
})

const GoalExportButton = () => {
  const [loading, setLoading] = useState(false);
  const { loadingMentor, mentor, error: mentorError } = useMentor();

  useEffect(() => {
    if (mentorError) {
      toast.error("Cannot fetch mentor detail for CSV export. Please refresh the page");
    }
    return () => toast.dismiss();
  }, [mentorError])

  const download = async () => {
    try {
      setLoading(true);
      // Load the data
      const apiRes = await goalsApi.get<Goal[]>('');
      if (apiRes.status !== 200) throw new Error();

      // Transform to CSV
      const rows = apiRes.data.map(goal => ({
        "Mentor Name": `${mentor.firstname} ${mentor.surname}`,
        ...goal2CSVRow(goal)
      }));
      const csv = unparse(rows, {
        quotes: true
      });

      // Download
      const a = document.createElement('a');
      const file = new Blob([csv], {type: 'text/plain'});
      a.href = URL.createObjectURL(file);
      a.download = "goals.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (_err) {
      toast.error("Cannot export goals. Please try again later");
    } finally {
      setLoading(false);
    }
  }

  return <>
    <LoadingButton
      onClick={download}
      disabled={loadingMentor || loading || !!mentorError}
      startIcon={<DownloadIcon />}
      variant="outlined"
      loading={loading}
      loadingPosition="start">
      Export
    </LoadingButton>
  </>
};

export default GoalExportButton;