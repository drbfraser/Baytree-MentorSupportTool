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
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Stack from '@mui/material/Stack';
import { Box, minWidth } from '@mui/system';
import { Grid } from '@material-ui/core';



export default function CreateGoals() {


    const [contents, setContents] = useState('');
    const [goal_review_date, setGoal_review_date ] = useState(new Date("2021-11-15"));
    const history = useHistory();
    const [errors, setErrors] = useState(false);
    const [date, setDate] = useState(new Date("2021-11-15"));

    const [submit, setSubmit] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleDateChange = (date: any) => {
        setDate(date);
    }

    const handlereviewDateChange = (date: any) => {
        setGoal_review_date(date);
    }

    const goal = {
        mentor: localStorage.getItem('id'),
        date: date,
        goal_review_date: goal_review_date,
        content: contents
      };



    const handleSubmit = () => {
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
             .then(response => response.json())
             .then(() => history.push('/dashboard/Goals'))
         
    }}

    return (
        <div>
            <Card sx={{ border: 0.1, boxShadow: 2, borderRadius: 5, p: 3, mb: 5}}>
                {submit === true && <Alert severity="success" sx={{ mb: 2 }}>Goal Successfully Set</Alert>}
                <Fab color="primary" variant="extended" aria-label="add" onClick={handleClickOpen}>
                    <AddIcon />
                    Add New Goal
                </Fab>
            </Card>
            <Grid item style = {{minWidth: "500px"}}> 
            <Dialog open={open} onClose={handleClose}>
                
               
                <DialogTitle color = "success"> <u>Create New Goal</u></DialogTitle>
                <DialogContent>
                
                

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Stack spacing={3}>
                            <KeyboardDatePicker
                                id="Date"
                                label="Date"
                                value={date}
                                onChange={handleDateChange}
                                fullWidth

                            />

                            <KeyboardDatePicker
                                id="Date"
                                label="Goal Review Date"
                                format="MM/dd/yyyy"
                                fullWidth
                                value={goal_review_date}
                                onChange={handlereviewDateChange}
                            />

                        </Stack>
                    </MuiPickersUtilsProvider>
                    <br />

                
                    <TextField
                        sx = {{ml: 5, p: '5px', mb: 5, width: 100}}
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
            </Grid> 
        </div>
    )
};
function setValue(newValue: Date | null) {
    throw new Error('Function not implemented.');
}

