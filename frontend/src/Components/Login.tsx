import React, { useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';

import Logo from '../Assets/baytree-logo.png';
import { CardContent } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            window.location.replace('http://localhost:3000/dashboard');
        }
        else {
            setLoading(false);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = {
            email: email,
            password: password
        };

        fetch('http://localhost:8000/rest-auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.key){
                localStorage.clear();
                localStorage.setItem('token', data.key);
                window.location.replace('http://localhost:3000/dashboard'); 
            } 
            else {
                setEmail('');
                setPassword('');
                localStorage.clear();
                setErrors(true);
            }
        });
    };

    return (
        <div className="content">
            <Container component="main" maxWidth="xs">
                <Card>
                <CardContent style = {{padding: "30px"}}>
                {loading === false && 
                <Box   
                display = "flex"
                alignItems = "center"
                justifyContent = "center"
                margin = "30px">
                    <img src = {Logo} alt = "Logo" width = "null" height = "200" />
                </Box>}
                {errors === true && <Alert severity="warning">Invalid email or password</Alert>}
                {loading === false && (
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
                        <TextField
                        margin = "normal"
                        required
                        fullWidth
                        name = "password"
                        label = "Password"
                        type = "password"
                        id = "password"
                        value = {password}
                        autoComplete = "current-password"
                        onChange={e => setPassword(e.target.value)}
                        />
                        <Button 
                        type = "submit" 
                        value = "Login" 
                        fullWidth variant="contained" 
                        sx={{ mt: 3, mb: 2 }}> Sign In
                        </Button>
                    </Box>
                )}
                </CardContent>
                </Card>
            </Container>
        </div>
    );
};

export default Login;