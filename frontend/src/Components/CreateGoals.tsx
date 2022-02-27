import { useState } from 'react';
import { useHistory } from 'react-router';
import 'date-fns';
import moment from 'moment';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const  CreateGoals = (props:any) =>   {

    const [contents, setContents] = useState('');
    const [title, setTitle] = useState('');
    const [goal_review_date, setGoal_review_date ] = useState<Date | null>(null);
    const history = useHistory();
    const [errors, setErrors] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setTitle('');
        setGoal_review_date (null);
        setContents('');
    }

    const handlereviewDateChange = (date: any) => {
        setGoal_review_date(date);
    }

    const goal = {
        mentor: localStorage.getItem('user_id'),
        mentee: localStorage.getItem('user_id'),
        title: title,
        date: moment().format("YYYY-MM-DD"),
        goal_review_date: moment(goal_review_date).format("YYYY-MM-DD"),
        content: contents,
      };
  
    const handleSubmit = () => {
        setSubmit(true);
        setTimeout(() => {
            setSubmit(false);
        }, 5000);

        if (contents == ''){
            setErrors(true);
        } else {
            fetch('http://localhost:8000/goals/goal/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(goal),
                credentials: "include"
            })
            .then(response => console.log(response))
            .then(() => {
                props.onSubmit(); 
                history.push('/dashboard/Goals')
            })
        }
    };

    return (
        <div>
            <Button color = "success" variant="contained" size="small" onClick={handleClickOpen}><AddIcon  /></Button>
            <Dialog open={open} onClose={handleClose} maxWidth={"xs"}>
                <DialogTitle color = "success"> Create New Goal</DialogTitle>
                <DialogContent>
                <TextField 
                    id="Title"
                    label="Title"
                    variant="outlined"
                    required
                    fullWidth
                    margin="normal"
                    sx = {{mb: 3}}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
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
                    value = {contents}
                    onChange={(e) => setContents(e.target.value)}
                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={contents==''||title==''|| goal_review_date==null } onClick={() => { handleSubmit(); handleClose();}}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};
function setValue(newValue: Date | null) {
    throw new Error('Function not implemented.');
}

export default CreateGoals;