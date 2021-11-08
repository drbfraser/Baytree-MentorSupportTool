import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import NoteCard from './Notecard';

export default function Goals() {
    const [goals, setGoals] = useState([]);

    useEffect(() => {
      fetch('http://localhost:8000/goals/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then (response => response.json())
      .then (data => setGoals(data.data))
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

    console.log(goals);

    /*
    const handleDelete = async (id: string) => {
      await fetch('http://localhost:8000/goals' + id, {
        method: 'DELETE'
      })
      const newGoals = goals.filter(goals => goals.id != id)
      setGoals(newGoals)
    }
    */
    return (
      <Container>
        <Grid container spacing={3}>
          {goals.map(goals => (
            <Grid item xs={12} md={6} lg={4}>
            <NoteCard />
            </Grid>
          ))}
        </Grid>
      </Container>
    )
}