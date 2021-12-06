import {useState, useEffect} from 'react';

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography';

import Tree from '../Assets/baytree.png';

export default function MenteeInfo() {
    const [menteeInfo, setMenteeInfo] = useState([] as any[]);
    const [currentMentee, setCurrentMentee] = useState(0);

    const handleClick = (event: any) => {
        var len: number = Object.values(menteeInfo).length;
        var newValue: number = currentMentee + 1;

        if (newValue >= len){
            newValue = 0;
        }
        setCurrentMentee(newValue);
    };
    
    useEffect(() => {
        fetch('http://localhost:8000/users/mentors/1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then (response => response.json())
        .then (data => setMenteeInfo(data.data.menteeuser))
        .catch((error) => {
          console.error('Error:', error);
        });
    }, []); 

    return (
        <div>
            <Card sx = {{border: 0.1, boxShadow: 2, borderRadius: 5, p: 3, pl: 5, pr: 5, mb: 0}}>
                <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
                    Mentee Information
                </Typography>
                {Object.values(menteeInfo).map((data, index: number, arr) => (
                    index == currentMentee ?
                    (<div>
                        <Typography variant = "overline" align = "left" sx = {{mt: 1}} color="text.secondary">
                            Name:
                        </Typography>
                        <Typography align = "right" sx = {{mt: -1, mb: 1}}>
                            {data.user.first_name} {data.user.last_name}
                        </Typography>
                        <Divider />
                        <Typography variant = "overline" align = "left" sx = {{mt: 1}} color="text.secondary">
                            Email:
                        </Typography>
                        <Typography align = "right" sx = {{mt: -1, mb: 1}}>
                            {data.user.email}
                        </Typography>
                        <Divider />
                        <Typography variant = "overline" align = "left" sx = {{mt: 1}} color="text.secondary">
                            DOB:
                        </Typography>
                        <Typography align = "right" sx = {{mt: -1, mb: 1}}>
                            18 Jan, 1996
                        </Typography>
                        <Divider />
                        <Typography variant = "overline" align = "left" sx = {{mt: 1}} color="text.secondary">
                            Age:
                        </Typography>
                        <Typography align = "right" sx = {{mt: -1, mb: 1}}>
                            25
                        </Typography>
                        <Divider />
                        <Typography variant = "overline" align = "left" sx = {{mt: 1}} color="text.secondary">
                            Start Date:
                        </Typography>
                        <Typography align = "right" sx = {{mt: -1, mb: 1}}>
                            31 Jan, 2020
                        </Typography>
                        <Divider />
                        <Typography variant = "overline" align = "left" sx = {{mt: 1}} color="text.secondary">
                            End Date:
                        </Typography>
                        <Typography align = "right" sx = {{mt: -1, mb: 1}}>
                            N/A
                        </Typography>
                    </div>)
                    : null
                ))}
            <Divider/>
            <Button variant="text" onClick = {handleClick} sx = {{ml: 9}}>Next Mentee</Button>
            <Box  
                display="flex" 
                alignItems="center"
                justifyContent="center"
                height={200}
                sx = {{pl: 5}}>
                <img src = {Tree} width = "null" height = "150" />
            </Box>
            </Card>
        </div>
    );
}
