import {useState} from 'react'

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import TimePicker from '@mui/lab/TimePicker';
import Typography  from "@mui/material/Typography";

const Sessions = () => {

  const [value, setValue] = useState<Date | null>(
    new Date('2014-08-18T21:11:54'),
  );

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    alert('Thank you! Your answers have been submitted');
    e.preventDefault();
  }

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
            <TextField 
              variant="outlined"
              sx = {{mt: 0, pt: 0, mb: 5}}
              required
              margin="normal"
            />
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing = {10}>
                <Grid item xs = {6}>
                  <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">Clock In Time</Typography>
                  <TimePicker
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs = {6}>
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