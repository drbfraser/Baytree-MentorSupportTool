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
        fetch(`http://localhost:8000/users/mentors?id=${localStorage.getItem('user_id')}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include"
        })
        .then (response => response.json())
        .then ((data: any) => {console.log(data); setMenteeInfo(data.data[0].menteeUsers)})
        .catch((error: any) => {
          console.error('Error:', error);
        });
    }, []); 

    return (
        <div>
                <Typography component="h2" variant="button" sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                    Mentee Information
                </Typography>
                {menteeInfo && Object.values(menteeInfo).map((data, index: number, arr) => (
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
                      
                    </div>)
                    : null
                ))}
            <Divider/>
            <Button variant="outlined" onClick = {handleClick} sx = {{mt:3}}>Next Mentee</Button>
            <Card/>
        </div>
    );
}
