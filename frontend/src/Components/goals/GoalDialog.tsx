import { DatePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Goal, GoalInput, submitGoal } from "../../api/goals";
import useMentees from "../../hooks/useMentees";
import Loading from "../shared/Loading";

const initialAnswer = (goal?: Goal) => {
  if (!goal) return {
    title: "",
    description: "",
    goal_reivew_date: new Date(),
    mentee_id: ""
  } as GoalInput;
  return {
    title: goal.title,
    description: goal.description,
    goal_reivew_date: new Date(goal.goal_review_date),
    mentee_id: goal.mentee?.viewsPersonId || ""
  } as GoalInput
}

const emptyAnswer = (input: GoalInput) => {
  return input.title === "" || input.description === ""
}

type Props = {
  goal?: Goal,
  open: boolean,
  handleClose: (refresh?: boolean) => void
}

const GoalDialog: FunctionComponent<Props> = ({ goal, open, handleClose }) => {
  const navigate = useNavigate();
  const { mentees, loadingMentees } = useMentees();
  const title = goal ? "Edit goal" : "Create new goal";
  const { values, handleSubmit, handleChange, setFieldValue, isSubmitting, setSubmitting } = useFormik({
    initialValues: initialAnswer(goal),
    onSubmit: async (answer) => {
      setSubmitting(true);
      const success = await submitGoal(answer, goal?.id);
      setSubmitting(false);
      if (!success) { 
        toast.error("Goal submitted unsuccessfully");
        return;
      }
      toast.success("Goal submitted successfully");
      handleClose(true);
    }
  });

  return <Dialog open={open} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    {(!mentees || loadingMentees) && <Loading />}
    {mentees &&
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography sx={{ fontWeight: "bold" }} color="text.secondary" gutterBottom>
            Title
          </Typography>
          <TextField fullWidth sx={{ mb: 2 }} name="title" value={values.title} onChange={handleChange} />

          <Typography sx={{ fontWeight: "bold" }} color="text.secondary" gutterBottom>
            Mentee
          </Typography>
          <Select
            fullWidth
            name="mentee_id"
            sx={{ mb: 2 }}
            value={values.mentee_id ? `${values.mentee_id}` : ""}
            onChange={handleChange}
            displayEmpty>
            <MenuItem value="" disabled>
              Please select a mentee
            </MenuItem>
            {mentees.map((mentee) => {
              const fullName = `${mentee.firstName} ${mentee.lastName}`;
              return (
                <MenuItem key={mentee.viewsPersonId} value={mentee.viewsPersonId}>
                  {fullName}
                </MenuItem>
              );
            })}
          </Select>

          <Typography sx={{ fontWeight: "bold" }} color="text.secondary" gutterBottom>
            Review date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat="MM/dd/yyyy"
              value={values.goal_reivew_date}
              onChange={(value) =>
                setFieldValue("goal_reivew_date", value, true)
              }
              renderInput={(params) => <TextField fullWidth {...params} sx={{ mb: 2 }} />}
            />
          </LocalizationProvider>

          <Typography sx={{ fontWeight: "bold" }} color="text.secondary" gutterBottom>
            Description
          </Typography>
          <TextField fullWidth sx={{ mb: 2 }} name="description" value={values.description} onChange={handleChange} multiline minRows={3} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose()}
            disabled={isSubmitting}>Cancel</Button>
          <LoadingButton
            variant="contained"
            type="submit"
            disabled={emptyAnswer(values) || isSubmitting}
            loading={isSubmitting}
          >Submit</LoadingButton>
        </DialogActions>
      </form>
    }


  </Dialog >
}

export default GoalDialog;