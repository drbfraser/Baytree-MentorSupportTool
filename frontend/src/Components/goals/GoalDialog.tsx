import { DatePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormik } from "formik";
import { FunctionComponent } from "react";
import { toast } from "react-toastify";
import { Goal, GoalInput } from "../../api/goals";
import useMentees from "../../hooks/useMentees";
import Loading from "../shared/Loading";

const initialAnswer = (goal?: Goal) => {
  if (!goal) return {
    title: "",
    description: "",
    goal_review_date: new Date(),
    mentee_id: ""
  } as GoalInput;
  return {
    title: goal.title,
    description: goal.description,
    goal_review_date: new Date(goal.goal_review_date),
    mentee_id: goal.mentee?.viewsPersonId || ""
  } as GoalInput
}

const emptyAnswer = (input: GoalInput) => {
  return !input.title || !input.description || !input.mentee_id
}

interface Props {
  goal?: Goal,
  open: boolean,
  handleClose: (refresh?: boolean) => void,
  handleSubmitGoal: (goal: GoalInput, id?: number) => Promise<boolean>
}

const GoalDialog: FunctionComponent<Props> = ({ goal, open, handleClose, handleSubmitGoal }) => {
  const { mentees, loadingMentees } = useMentees();
  const title = goal ? "Edit goal" : "Create new goal";
  const { values, handleSubmit, handleChange, setFieldValue, isSubmitting, setSubmitting } = useFormik({
    initialValues: initialAnswer(goal),
    onSubmit: async (answer) => {
      setSubmitting(true);
      const success = await handleSubmitGoal(answer, goal?.id);
      setSubmitting(false);
      if (!success) {
        toast.error("Goal submitted unsuccessfully");
        return;
      }
      toast.success("Goal submitted successfully");
      handleClose();
    }
  });

  return <Dialog open={open} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    {(!mentees || loadingMentees) && <Loading />}
    {mentees &&
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            required
            fullWidth sx={{ mb: 2 }}
            value={values.title}
            onChange={handleChange} />
          <FormControl fullWidth required>
            <InputLabel id="mentee-label">Mentee</InputLabel>
            <Select
              labelId="mentee-label"
              label="Mentee"
              name="mentee_id"
              sx={{ mb: 2 }}
              value={values.mentee_id ? `${values.mentee_id}` : ""}
              onChange={handleChange}>
              <MenuItem value="" disabled>
                <em>Please select a mentee</em>
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
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Goal Review Date"
              inputFormat="MM/dd/yyyy"
              value={values.goal_reivew_date}
              onChange={(value) =>
                setFieldValue("goal_reivew_date", value, true)
              }
              renderInput={(params) =>
                <TextField required fullWidth {...params} sx={{ mb: 2 }} />}
            />
          </LocalizationProvider>
          <TextField label="Description" required fullWidth sx={{ mb: 2 }} name="description" value={values.description} onChange={handleChange} multiline minRows={3} />
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