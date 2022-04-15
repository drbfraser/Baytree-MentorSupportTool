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
import { format, intervalToDuration } from 'date-fns'
import { API_BASE_URL } from '../api/url';
import moment from 'moment'

const Sessions = () => {

  const [mentee, setMentee] = useState('');
  const [sessionCancelled, setSessionCancelled] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [clockInTime, setClockInTime] = useState<Date>(new Date());
  const [clockOutTime, setClockOutTime] = useState<Date>(new Date(clockInTime.getTime() + 60000)); // 1 minute is 60000 miliseconds
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

  const handleDuration = ()=>{

    // getting the Duration hour
    const hour = intervalToDuration({
      start: clockInTime,
      end: clockOutTime
    }).hours

    // getting the Duration minute
    const minute = intervalToDuration({
      start: clockInTime,
      end: clockOutTime
    }).minutes

    // check if both hour and minute are one digit
    if((minute && minute < 10) && (hour && hour < 10)){
      return(`0${intervalToDuration({
        start: clockInTime,
        end: clockOutTime
      }).hours}:0${intervalToDuration({
        start: clockInTime,
        end: clockOutTime
      }).minutes}`)
    }

    // check if the hour is one digit
    else if (hour && hour < 10){
      return(`0${intervalToDuration({
        start: clockInTime,
        end: clockOutTime
      }).hours}:${intervalToDuration({
        start: clockInTime,
        end: clockOutTime
      }).minutes}`)
    }

    // check if the minute is one digit
    else if (minute && minute < 10){
      return(`${intervalToDuration({
        start: clockInTime,
        end: clockOutTime
      }).hours}:0${intervalToDuration({
        start: clockInTime,
        end: clockOutTime
      }).minutes}`)
    }

    //both minute and hour are 2 digit
    else{
      return(`${intervalToDuration({
        start: clockInTime,
        end: clockOutTime
      }).hours}:${intervalToDuration({
        start: clockInTime,
        end: clockOutTime
      }).minutes}`)
    }
  }

  const handleStartTime= ()=>{
    return moment(clockInTime).format("HH:mm")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    alert('Thank you! Your answers have been submitted');
    e.preventDefault();

    const viewSession = {
      StartDate: `${format(date, 'yyyy-MM-dd')}`,
      StartTime: handleStartTime(),
      Duration: handleDuration(),
      CancelledSession: (sessionCancelled === true) ? '1' : '0' ,
      CancelledAttendee: (sessionCancelled === true) ? '0' : '1',
      LeadStaff: localStorage.getItem('user_id'),
      Notes: notes
    };

    fetch(`${API_BASE_URL}/sessions/viewsapp/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(viewSession),
      credentials: "include"
    })
    .then(response => response.json()) 
  }

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/mentors?id=${localStorage.getItem('user_id')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include"
    })
    .then (response => response.json())
    .then (data => setMenteeList(data.data.menteeuser || []))
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
          autoComplete="off">
        
          <FormControl fullWidth>
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
            <Divider sx = {{pt: 2, pb: 2}}/>
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
            <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">{sessionCancelled ?'If you or the mentee did not attend the session, please enter when the session was suppose to happen!' :''}
           </Typography>
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