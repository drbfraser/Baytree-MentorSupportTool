import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { CardContent } from '@mui/material';

export default function ResetPassword(){

    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
  
    return (
        <div className="content">
            <Container component="main" maxWidth="xs">
                <Card>
                <CardContent style = {{padding: "30px"}}>
                <Typography variant = "h4" 
                            display = "flex" 
                            alignItems = "center" 
                            justifyContent = "center"
                            sx = {{mb: 3}}>
                                Reset Password
                </Typography>
                <Typography display = "flex" align = "center" justifyContent = "center" sx = {{mb: 3}}>
                    Please enter your email address to request a password reset
                </Typography>
                <Divider sx = {{mb: 3}}/>
                <Box component="form" onSubmit={handleSubmit} noValidate sx = {{ mt: 1 }}>
                    <TextField
                    margin = "normal"
                    required
                    fullWidth
                    id = "email"
                    label = "Email Address"
                    name = "email"
                    autoComplete = "email"
                    value = {email}
                    autoFocus
                    onChange={e => setEmail(e.target.value)}
                    />
                    <Button 
                    type = "submit" 
                    value = "Login" 
                    fullWidth variant="contained" 
                    color = "success"
                    sx={{ mt: 3, mb: 2 }}> Reset Password
                    </Button>
                    <Typography variant = "caption" display = "block" align = "center">
                        <a href="http://localhost:3000/login">Back to login</a>
                    </Typography>
                </Box>
                </CardContent>
                </Card>
            </Container>
        </div>
    )
};