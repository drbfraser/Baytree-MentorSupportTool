import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router';
import Goals from './Goals';



const CreateGoals = () => {
    
    const [goalName, setGoalName] = useState('');
    const [details, setDetails] = useState('');
    const history = useHistory();
    const [errors, setErrors] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ( goalName == '' || details == ''){
            setErrors(true);
        }
        else{
            fetch('http://localhost:8000/goals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ goalName, details })
        })
            .then(response => response.json())
            .then(() => history.push('/'))
        }
        
    }


    return (
        
        <div>
            
            <Typography
                variant="h6"
                color="textSecondary"
                component="h2"
                gutterBottom
            >
                <h1>Add a new Goal</h1>
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    '& > :not(style)': { m: 5, width: '70ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
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
                <Button
                    type="submit"
                    color="success"
                    variant="contained"
                    fullWidth
                >
                    Submit
                </Button>
            </Box>
            
            

        </div>
    )
};

export default CreateGoals;

