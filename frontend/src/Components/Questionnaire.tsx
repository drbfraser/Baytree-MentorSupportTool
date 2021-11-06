import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";

const Questionnaire = () => {

  const [formData, setFormData] = useState([] as any[]);
  const [answers, setAnswers] = useState({answer: ''});

  let values: { [key: string]: string } = {};

  useEffect(() => {
    fetch('http://localhost:8000/monthly-report/get-report/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then (response => response.json())
    .then (data => setFormData(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }, []);

  useEffect(() => {
    

    for (let entry in formData) {
      values = {...values, entry: ''};
      console.log(entry)
      console.log(values);
    }
  }, [formData]);

  console.log(values);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    alert('A name was submitted:');
    const formData = new FormData(e.currentTarget);
    e.preventDefault();
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    console.log(formData.entries())
  }
  
  return (
    <Container 
      maxWidth = "md" 
      sx = {{border: 0.1, boxShadow: 2, borderRadius: 5, pt: 2, mt: 3}}
      style={{ background: '#ffffff' }}>
      <h3>Monthly Progress Report</h3>
      <Divider />

      <Box component="form"
        sx = {{margin: 5}}
        onSubmit = {handleSubmit} 
        noValidate
        autoComplete="off">
          
        {Object.values(formData).map((data, index) => 
            <FormControl fullWidth>
              <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}}>{index + 1}. {data.Question}</Typography>
              {(function () {
                switch (data.inputType) {
                  case 'text':
                    return (
                      <TextField 
                        key = {data.QuestionID}
                        variant="outlined"
                        sx = {{mt: 0, pt: 0, mb: 5}}
                        required
                        value = {values[index]}
                        margin="normal"
                        onChange = {e => setAnswers(Object.assign({}, answers, { answer: e.target.value }))}
                      />
                    );
                  case 'number':
                    return (
                      <RadioGroup
                        key = {data.QuestionID}
                        row
                        aria-label = "gender"
                        name = "radio-buttons-group"
                        sx = {{mt: 2, pt: 0, mb: 5, gap: 5}}
                      >
                        <FormControlLabel value="1" control={<Radio />} label="Strongly Disagree" labelPlacement="top"/>
                        <FormControlLabel value="2" control={<Radio />} label="Disagree" labelPlacement="top"/>
                        <FormControlLabel value="3" control={<Radio />} label="Neutral" labelPlacement="top"/>
                        <FormControlLabel value="4" control={<Radio />} label="Agree" labelPlacement="top"/>
                        <FormControlLabel value="5" control={<Radio />} label="Strongly Agree" labelPlacement="top"/>
                      </RadioGroup>
                    );
                  default:
                    break
              }})()}
              <Divider />
            </FormControl>
        )}
        <Button variant="contained" type = "submit" sx = {{mt: 3}}>Submit</Button>
      </Box>
    </Container>
  )
};
  
export default Questionnaire;
