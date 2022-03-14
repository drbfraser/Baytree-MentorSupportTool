import {useState, useEffect} from 'react'

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import DatePicker from '@mui/lab/DatePicker';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import TimePicker from '@mui/lab/TimePicker';
import Typography  from "@mui/material/Typography";
import { API_BASE_URL } from '../api/url';

const Sessions = () => {

  const [mentee, setMentee] = useState('');
  const [mentorAttendance, setMentorAttendance] = useState(false);
  const [menteeAttendance, setMenteeAttendance] = useState(false);
  const [sessionCancelled, setSessionCancelled] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [clockInTime, setClockInTime] = useState<Date>(new Date());
  const [clockOutTime, setClockOutTime] = useState<Date >(new Date());
  const [notes, setNotes] = useState('');
  const [menteeList, setMenteeList] = useState([] as any[]);
  
  const handleDateChange = (newValue: Date | null) => {
    if(newValue){
      setDate(newValue);
    }
  };
  const handleClockInChange = (newValue: Date | null) => {
    if(newValue){
      setClockInTime(newValue);
    }
  };
  const handleClockOutChange = (newValue: Date | null) => {
    if(newValue){
      setClockOutTime(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    alert('Thank you! Your answers have been submitted');
    e.preventDefault();

    const session = {
      mentor: localStorage.getItem('id'),
      mentee: mentee,
      attended_by_mentor: mentorAttendance,
      attended_by_mentee: menteeAttendance,
      clock_in: clockInTime,
      clock_out: clockOutTime,
      notes: notes
    };

    const viewSession = {
      StartDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      StartTime: `${clockInTime.getHours()}:${clockInTime.getMinutes()}`,
      Duration: `${clockOutTime.getHours() - clockInTime.getHours()}:${clockOutTime.getMinutes() - clockInTime.getMinutes()}`,
      Cancelled: sessionCancelled,
      LeadStaff: 1,
    };

   /* fetch(`${API_BASE_URL}/sessions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(session),
        credentials: "include"
    })
    .then(response => response.json())*/

    fetch(`${API_BASE_URL}/sessions/viewsapp/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(viewSession),
      credentials: "include"
    })
    .then(response => {
      console.log('Success:', response.json());
      console.log("session frontend")
      console.log(session)
    })

   // window.location.replace('/dashboard/home'); 
  }

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/mentors/1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include"
    })
    .then (response => response.json())
    .then (data => setMenteeList(data.data.menteeuser))
    .catch((error) => {
      console.error('Error:', error);
    });
  }, []);

  return (
    <Grow in={true}>
    <Container 
        maxWidth = "md" 
        sx = {{border: 0.1, boxShadow: 2, borderRadius: 5, pt: 2, mt: 3}}
        style={{ background: '#ffffff' }}>
        <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
            Create Session
        </Typography>
        <Divider />

        <Box component="form"
          sx = {{margin: 5, mt: 2}}
          onSubmit = {handleSubmit} 
          noValidate
          autoComplete="off">
        
          <FormControl fullWidth>
            <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Mentee Name</Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={mentee}
              onChange={e => setMentee(e.target.value)}
            >
            {Object.values(menteeList).map((data) => 
              <MenuItem value={data.user.id}>{data.user.first_name} {data.user.last_name}</MenuItem>
            )}
            </Select>
            <Divider sx = {{pt: 2, pb: 2}}/>
            <Grid container spacing = {2}>
              <Grid item xs = {6}>
                <Grid container spacing = {1}>
                  <Grid item xs = {10}>
                    <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Check if the session didn't take place?</Typography>
                  </Grid>
                  <Grid item xs = {2} sx = {{mt: 1.8}}>
                    <Checkbox checked={sessionCancelled} onChange={e => setSessionCancelled(e.target.checked)} {...label} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing = {2}>
              <Grid item xs = {6}>
                <Grid container spacing = {1}>
                  <Grid item xs = {10}>
                    <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Did the mentor attend the session?</Typography>
                  </Grid>
                  <Grid item xs = {2} sx = {{mt: 1.8}}>
                    <Checkbox checked={mentorAttendance} onChange={e => setMentorAttendance(e.target.checked)} {...label} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs = {6}>
                <Grid container spacing = {1}>
                  <Grid item xs = {10}>
                    <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Did the mentee attend the session?</Typography>
                  </Grid>
                  <Grid item xs = {2} sx = {{mt: 1.8}}>
                    <Checkbox checked={menteeAttendance} onChange={e => setMenteeAttendance(e.target.checked)} {...label} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider sx = {{pt: 2, pb: 2}}/>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing = {1}>
                <Grid item xs = {4}>
                  <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Date</Typography>
                  <DatePicker
                    inputFormat="MM/dd/yyyy"
                    value={date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs = {4}>
                  <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Clock In Time</Typography>
                  <TimePicker
                    value={clockInTime}
                    onChange={handleClockInChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs = {4}>
                  <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Clock Out Time</Typography>
                  <TimePicker
                    value={clockOutTime}
                    onChange={handleClockOutChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
            <Divider sx = {{pt: 2, pb: 2}}/>

            <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">{sessionCancelled ?'If you or the mentee did not attend the session, please explain why' :'Please enter your notes'}
           </Typography>
            <TextField 
              variant="outlined"
              sx = {{mt: 0, pt: 0, mb: 5}}
              multiline
              rows={8}
              required
              margin="normal"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />

          <Divider />
          </FormControl>
        <Button variant="contained" type = "submit" sx = {{mt: 3}}>Submit</Button>
      </Box>
    </Container>
    </Grow>
    )
  };
  
  export default Sessions;