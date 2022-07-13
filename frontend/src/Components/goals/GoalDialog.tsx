import { DatePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
  Alert, 
  AlertTitle, 
  Button, 
  Checkbox, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  FormControl, 
  FormControlLabel, 
  FormGroup, 
  FormLabel, 
  TextField
} from "@mui/material";
import { useFormik } from "formik";
import { FunctionComponent } from "react";
import { toast } from "react-toastify";
import { Goal, GoalInput } from "../../api/goals";
import { useGoalCategories } from "../../hooks/useGoals";
import Loading from "../shared/Loading";

const initialAnswer = (goal?: Goal) => {
  if (!goal) return {
    title: "",
    description: "",
    goal_review_date: new Date(),
    categories: []
  } as GoalInput;
  return {
    title: goal.title,
    description: goal.description,
    goal_review_date: new Date(goal.goal_review_date),
    categories: goal.options
  } as GoalInput
}

const emptyAnswer = (input: GoalInput) => {
  return !input.title || !input.description;
}

interface Props {
  goal?: Goal,
  open: boolean,
  handleClose: (refresh?: boolean) => void,
  handleSubmitGoal: (goal: GoalInput, id?: number) => Promise<boolean>
}

const GoalDialog: FunctionComponent<Props> = ({ goal, open, handleClose, handleSubmitGoal }) => {
  const { categories, loading, error } = useGoalCategories();
  const title = goal ? "Edit goal" : "Create new goal";

  const { values, handleSubmit, handleChange, setFieldValue, isSubmitting, setSubmitting } = useFormik({
    initialValues: initialAnswer(goal),
    onSubmit: async (answer) => {
      setSubmitting(true);
      const success = await handleSubmitGoal(answer, goal?.id);
      setSubmitting(false);
      if (!success) {
        toast.error("Goal submitted unsuccessfully. Please try again");
        return;
      }
      toast.success("Goal submitted successfully");
      handleClose();
    }
  });

  const handleCategoriesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {checked, value} = event.target;
    if (checked) {
      setFieldValue("categories", [
        ...values.categories,
        ...categories.filter(item => item.id === +value)
      ])
    } else {
      setFieldValue("categories", values.categories.filter(item => item.id !== +value));
    }
  };

  return <Dialog open={open} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    {loading && <Loading />}
    {!loading && error &&
      <Alert severity="error">
        <AlertTitle>{error}</AlertTitle>
        Please try again later
      </Alert>}
    {!loading && !error &&
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Title */}
          <TextField
            label="Title"
            name="title"
            required
            fullWidth sx={{ mb: 2 }}
            value={values.title}
            onChange={handleChange} />
          {/* Date selection */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Goal Review Date"
              inputFormat="MM/dd/yyyy"
              value={values.goal_review_date}
              onChange={(value) =>
                setFieldValue("goal_review_date", value, true)
              }
              renderInput={(params) =>
                <TextField required fullWidth {...params} sx={{ mb: 2 }} />}
            />
          </LocalizationProvider>
          {/* Description */}
          <TextField
            label="Description"
            name="description"
            required fullWidth sx={{ mb: 2 }}
            value={values.description}
            onChange={handleChange}
            multiline minRows={3} />
          {/* Goal category */}
          <FormControl sx={{ mb: 2 }} fullWidth>
            <FormLabel component="legend">Categories</FormLabel>
            <FormGroup>
              {
                categories.map(category => (
                  <FormControlLabel
                    key={category.id}
                    label={category.name}
                    control={
                      <Checkbox
                        checked={values.categories.findIndex(item => item.id === category.id) >= 0}
                        onChange={handleCategoriesChange}
                        value={category.id}
                       />
                    } />
                ))
              }
            </FormGroup>
          </FormControl>
        </DialogContent>
        {/* Buttons */}
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