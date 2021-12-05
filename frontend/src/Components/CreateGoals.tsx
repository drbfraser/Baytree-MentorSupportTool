import React, { useState } from 'react';
import { useHistory } from 'react-router';

import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import { lightGreen } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';




export default function CreateGoals() {
    
    const [goalName, setGoalName] = useState('');
    const [details, setDetails] = useState('');
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
            {submit === true && <Alert severity="success" sx = {{mb: 2}}>Goal Successfully Set</Alert>}
            <Button color = "success" variant="contained" size="large" onClick={handleClickOpen}><AddIcon  /> Add New Goal </Button>
        
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Goal</DialogTitle>
                <DialogContent>
                    <TextField
                        sx = {{mb: 2, mt: 2}}
                        onChange={(e) => setGoalName(e.target.value)}
                        id="Goal Name"
                        label="Goal Name"
                        variant="outlined"
                        required
                        fullWidth
                    />
                    <TextField
                        onChange={(e) => setDetails(e.target.value)}
                        id="Goal Details"
                        label="Goal Details"
                        variant="outlined"
                        required
                        multiline
                        rows={4}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => {handleClose(); handleSubmit();}}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};
