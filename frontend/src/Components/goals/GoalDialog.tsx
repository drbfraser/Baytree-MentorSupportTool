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
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { GoalDetail, GoalInput } from "../../api/goals";
import { useGoals } from "../../context/GoalContext";
import { useGoalCategories } from "../../hooks/useGoalCategories";
import useMentees from "../../hooks/useMentees";
import Loading from "../shared/Loading";

const initialAnswer = (goal?: GoalDetail) => {
  if (!goal) return {
    title: "",
    description: "",
    mentee_id: "",
    goal_review_date: new Date(),
    categories: []
  } as GoalInput;
  return {
    title: goal.title,
    description: goal.description,
    mentee_id: goal.mentee?.viewsPersonId || "",
    goal_review_date: new Date(goal.goal_review_date),
    categories: goal.categories
  } as GoalInput
}

const emptyAnswer = (input: GoalInput) => {
  return !input.title || !input.description;
}



const GoalDialog = () => {
  const {edit: {goal, open}, closeEdit} = useGoals();
  const { mentees, loadingMentees } = useMentees();
  const { handleSubmitGoal } = useGoals();
  const { categories, loading: loadingCategories, error: categoriesError } = useGoalCategories();
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
      closeEdit();
    }
  });

  const handleCategoriesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    if (checked) {
      setFieldValue("categories", [
        ...values.categories,
        ...categories.filter(item => item.id === +value)
      ])
    } else {
      setFieldValue("categories", values.categories.filter(item => item.id !== +value));
    }
  };

  const loading = loadingCategories || loadingMentees;
  let errorMessage = categoriesError;
  if (!errorMessage && !mentees) errorMessage = "Cannot load mentees";

  return <Dialog open={open} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    {loading && <Loading />}
    {!loading && errorMessage &&
      <Alert severity="error">
        <AlertTitle>{errorMessage}</AlertTitle>
        Please try again later
      </Alert>}
    {!loading && !errorMessage && mentees &&
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
          {/* Mentee */}
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
            onClick={closeEdit}
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