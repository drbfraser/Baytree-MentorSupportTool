import AddIcon from "@mui/icons-material/Add";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import "date-fns";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router";
import { updateGoal } from "../../api/goals";
import { useAuth } from "../../context/AuthContext";


const CreateGoals = (props: any) => {
  const { user } = useAuth();

  const [contents, setContents] = useState(
    props.goal ? props.goal.content : ""
  );
  const [title, setTitle] = useState(props.goal ? props.goal.title : "");
  const [menteeId, setMenteeId] = useState(
    props.goal ? props.goal.mentee || "" : ""
  );
  const [goal_review_date, setGoal_review_date] = useState<Date | null>(
    props.goal ? props.goal.goal_review_date : null
  );
  const [open, setOpen] = useState(props.goalId !== undefined);

  const navigate = useNavigate();
  const [, setErrors] = useState(false);
  const [, setSubmit] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setGoal_review_date(null);
    setContents("");
    if (props.onClose !== undefined) props.onClose();
  };

  const handlereviewDateChange = (date: any) => {
    setGoal_review_date(date);
  };

  const goal = {
    mentor: user!.userId,
    mentee: menteeId,
    title: title,
    date: moment().format("YYYY-MM-DD"),
    goal_review_date: moment(goal_review_date).format("YYYY-MM-DD"),
    content: contents
  };

  const handleSubmit = () => {
    setSubmit(true);
    setTimeout(() => {
      setSubmit(false);
    }, 5000);
    if (contents === "") {
      setErrors(true);
    } else {
      updateGoal(goal, props.goalId)
        .then((response) => console.log(response))
        .then(() => {
          props.onSubmit();
          navigate("/dashboard/goals");
        });
    }
  };

  return (
    <>
      {props.goalId === undefined && (
        <Button
          color="success"
          variant="contained"
          size="small"
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Button>
      )}
      <Dialog open={props.open || open} onClose={handleClose} maxWidth={"xs"}>
        <DialogTitle color="success">
          {props.goalId === undefined ? "Create New Goal" : "Edit Goal"}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="Title"
            label="Title"
            variant="outlined"
            required
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormControl
            sx={{ mt: 1, mb: 3 }}
            variant="outlined"
            fullWidth
            required
            margin="normal"
          >
            <InputLabel id="mentee-label">Mentee Name</InputLabel>
            <Select
              id="Mentee"
              labelId="mentee-label"
              label="Mentee Name"
              required
              value={menteeId}
              onChange={(e) => setMenteeId(e.target.value)}
            >
              {Object.values(props.menteeList).map((data: any) => (
                <MenuItem value={data.user.id}>
                  {data.user.first_name} {data.user.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Goal Review Date"
              inputFormat="MM/dd/yyyy"
              value={goal_review_date}
              onChange={handlereviewDateChange}
              renderInput={(params) => <TextField fullWidth {...params} />}
              minDate={new Date()}
            />
          </LocalizationProvider>
          <TextField
            id="Contents"
            label="Contents"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={6}
            margin="normal"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={
              contents === "" || title === "" || goal_review_date === null
            }
            onClick={() => {
              handleSubmit();
              handleClose();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateGoals;
