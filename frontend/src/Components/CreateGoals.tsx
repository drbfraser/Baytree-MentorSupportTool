import React, { useState } from 'react';
import { useHistory } from 'react-router';
import 'date-fns';

import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';


import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Stack from '@mui/material/Stack';



export default function CreateGoals() {

    const [goalName, setGoalName] = useState('');
    const [details, setDetails] = useState('');
    const history = useHistory();
    const [errors, setErrors] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date("2021-11-15T12:00:00"));

    const [submit, setSubmit] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleDateChange = (date: any) => {
        setCurrentDate(date);
    }



    const handleSubmit = () => {
        // if ( goalName == '' || details == ''){
        //     setErrors(true);
        // }
        // else {
        setSubmit(true);
        setTimeout(() => {
            setSubmit(false);
        }, 5000);
        //     fetch('http://localhost:8000/goals', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ goalName, details })
        // })
        //     .then(response => response.json())
        //     .then(() => history.push('/'))
        // }
    }

    return (
        <div>
            <Card sx={{ border: 0.1, boxShadow: 2, borderRadius: 5, p: 3, mb: 5 }}>
                {submit === true && <Alert severity="success" sx={{ mb: 2 }}>Goal Successfully Set</Alert>}
                <Fab color="primary" variant="extended" aria-label="add" onClick={handleClickOpen}>
                    <AddIcon />
                    Add New Goal
                </Fab>
            </Card>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Goal</DialogTitle>
                <DialogContent>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Stack spacing={3}>
                            <KeyboardDateTimePicker
                                id="Date"
                                label="Date"
                                value={currentDate}
                                onChange={handleDateChange}

                            />

                            <KeyboardDatePicker
                                id="Date"
                                label="Goal Review Date"
                                format="MM/dd/yyyy"
                                value={currentDate}
                                onChange={handleDateChange}
                            />

                        </Stack>
                    </MuiPickersUtilsProvider>
                    <br />


                    <TextField
                        onChange={(e) => setDetails(e.target.value)}
                        id="Contents"
                        label="Contents"
                        variant="outlined"
                        required
                        multiline
                        rows={4}
                        fullWidth
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

