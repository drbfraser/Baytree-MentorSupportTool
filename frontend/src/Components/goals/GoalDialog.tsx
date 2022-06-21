import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { FunctionComponent } from "react";
import { Goal } from "../../api/goals";
import useMentees from "../../hooks/useMentees";
import Loading from "../shared/Loading";

type GoalInput = {
  title: string;
  goal_reivew_date: Date;
  mentee_id?: number | string;
  description: string;
}

const initiialAnswer = (goal?: Goal) => {
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
    mentee_id: goal.mentee.viewsPersonId
  } as GoalInput
}

const GoalDialog: FunctionComponent<{ goal?: Goal } & DialogProps> = ({ goal, ...props }) => {
  const { mentees, loadingMentees } = useMentees();
  const title = goal ? "Edit goal" : "Create new goal";
  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: initiialAnswer(goal),
    onSubmit: (answer) => { }
  });

  console.log("Redering...");

  return <Dialog {...props}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {(!mentees || loadingMentees) && <Loading />}
      {mentees &&
        <form onSubmit={handleSubmit}>
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
              renderInput={(params) => <TextField fullWidth {...params} sx={{mb: 2}} />}
            />
          </LocalizationProvider>

          <Typography sx={{ fontWeight: "bold" }} color="text.secondary" gutterBottom>
            Description
          </Typography>
          <TextField fullWidth sx={{ mb: 2 }} name="description" value={values.description} onChange={handleChange} multiline minRows={3} />
        </form>}
    </DialogContent>
    <DialogActions>
      <Button>Cancel</Button>
      <Button>Submit</Button>
    </DialogActions>
  </Dialog>
}

export default GoalDialog;