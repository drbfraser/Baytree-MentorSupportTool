import {useState, useEffect} from 'react'

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import TimePicker from '@mui/lab/TimePicker';
import Typography  from "@mui/material/Typography";

const Sessions = () => {

  const [value, setValue] = useState<Date | null>(
    new Date('2014-08-18T21:11:54'),
  );
  const [menteeList, setMenteeList] = useState([] as any[]);

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    alert('Thank you! Your answers have been submitted');
    e.preventDefault();
  }

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  useEffect(() => {
    fetch('http://localhost:8000/users/mentors/1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then (response => response.json())
    .then (data => setMenteeList(data.data.menteeuser))
    .catch((error) => {
      console.error('Error:', error);
    });
  }, []);

  return (
    <Container 
        maxWidth = "md" 
        sx = {{border: 0.1, boxShadow: 2, borderRadius: 5, pt: 2, mt: 3}}
        style={{ background: '#ffffff' }}>
        <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
            Create Session
        </Typography>
        <Divider />

        <Box component="form"
          sx = {{margin: 5}}
          onSubmit = {handleSubmit} 
          noValidate
          autoComplete="off">
        
          <FormControl fullWidth>
            <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Mentee Name</Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value="John"
            >
            {Object.values(menteeList).map((data) => 
              <MenuItem value={data.user.first_name}>{data.user.first_name} {data.user.last_name}</MenuItem>
            )}
            </Select>
            <Grid container spacing = {2}>
              <Grid item xs = {6}>
                <Grid container spacing = {1}>
                  <Grid item xs = {10}>
                    <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Did the mentor attend the session?</Typography>
                  </Grid>
                  <Grid item xs = {2} sx = {{mt: 1.8}}>
                    <Checkbox {...label} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs = {6}>
                <Grid container spacing = {1}>
                  <Grid item xs = {10}>
                    <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Did the mentee attend the session?</Typography>
                  </Grid>
                  <Grid item xs = {2} sx = {{mt: 1.8}}>
                    <Checkbox {...label} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing = {1}>
                <Grid item xs = {4}>
                  <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Date</Typography>
                  <DesktopDatePicker
                    inputFormat="MM/dd/yyyy"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs = {4}>
                  <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Clock In Time</Typography>
                  <TimePicker
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs = {4}>
                  <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Clock Out Time</Typography>
                  <TimePicker
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>

            <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Session Notes. If you or the mentee did not attend the session, please explain why</Typography>
            <TextField 
              variant="outlined"
              sx = {{mt: 0, pt: 0, mb: 5}}
              multiline
              rows={8}
              required
              margin="normal"
            />


          <Divider />
          </FormControl>
        <Button variant="contained" type = "submit" sx = {{mt: 3}}>Submit</Button>
      </Box>
    </Container>
    )
  };
  
  export default Sessions;