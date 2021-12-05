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
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';




import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Stack from '@mui/material/Stack';
import { Box, minWidth } from '@mui/system';
import { Grid } from '@material-ui/core';
import { title } from 'process';



const  CreateGoals = () =>   {


    const [contents, setContents] = useState('');
    const [mentee, setMentee] = useState('');
    const [Title, setTitle] = useState('');
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
        mentee: localStorage.getItem('id'),
        title: Title,
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
            
            <Button color = "success" variant="contained" size="large" onClick={handleClickOpen}><AddIcon  /> Add New Goal </Button>

            
            {submit === true && <Alert severity="success" sx = {{ position: 'absolute', top: 250, right: 500,}}><strong>Goal Successfully Set</strong></Alert>}
            
        
            <Dialog open={open} onClose={handleClose}>
                
               
                <DialogTitle color = "success"> Create New Goal</DialogTitle>
                <DialogContent>

                <TextField 
                    id="Title"
                    label="Title"
                    variant="outlined"
                    sx = {{mt: 0, pt: 0, mb: 5}}
                    multiline
                    rows={2}
                    required
                    fullWidth
                    margin="normal"

                    value={Title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                
                

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
            
        </div>
    )
};
function setValue(newValue: Date | null) {
    throw new Error('Function not implemented.');
}

export default CreateGoals;