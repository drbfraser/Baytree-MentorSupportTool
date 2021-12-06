import { useState } from 'react';
import { useHistory } from 'react-router';
import 'date-fns';

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

const  CreateGoals = () =>   {

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
    }

    const handlereviewDateChange = (date: any) => {
        setGoal_review_date(date);
    }

    const goal = {
        mentor: localStorage.getItem('id'),
        mentee: localStorage.getItem('id'),
        title: title,
        date: "2021-12-16",
        goal_review_date: "2021-12-16",
        content: contents,
      };

    const handleSubmit = () => {
            setSubmit(true);
            setTimeout(() => {
                setSubmit(false);
             }, 5000);
         if ( contents == ''){
             setErrors(true);
         }
         else {
             fetch('http://localhost:8000/goals/goal/', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
            
             body: JSON.stringify(goal)
         })
             .then(response => console.log(response))
             .then(() => history.push('/dashboard/Goals'))
    }}

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
                    <Button onClick={() => { handleClose(); handleSubmit(); }}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};
function setValue(newValue: Date | null) {
    throw new Error('Function not implemented.');
}

export default CreateGoals;