import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grow from '@mui/material/Grow'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography  from "@mui/material/Typography";
import { API_BASE_URL } from "../api/url";

const Questionnaire = () => {

  const [formData, setFormData] = useState([] as any[]);
  const [answers, setAnswers] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/questionnaires/get_questionnaire/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include"
    })
    .then (response => response.json())
    .then (data => setFormData(data))
    .then (() => setLoading(false))
    .catch((error) => {
      console.error('Error:', error);
    });
  }, []);

  const isValid = () => {
    for (let [key, value] of Object.entries(formData))
   
      if (answers[value.QuestionID] == undefined || answers[value.QuestionID].length == 0){
        return false
      }
      return true
  }
  const handleSubmitResponse = (response: any) => {
    if (response.status == 200) {
      alert('Succesfully Submitted, Thank you!')
      setAnswers({})
    } else {
      alert('Failed to Submit, Error: '+ response)
    }
  }

  const handleSubmit = () => {
    answers['mentorId'] = localStorage.getItem('id')

    fetch(`${API_BASE_URL}/questions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(answers)
    })
    .then (response => handleSubmitResponse(response))
  }
  return (
    <Grow in={true}>
    <Container 
      maxWidth = "md" 
      sx = {{border: 0.1, boxShadow: 2, borderRadius: 5, pt: 2, mt: 3}}
      style={{ background: '#ffffff' }}>
      <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
          Monthly Progress Report
      </Typography>
      <Divider />

      <Box sx = {{margin: 5}}>
        
        {loading === true &&
        <div>
          <Skeleton variant="rectangular" width={200} height={30} sx = {{mb: 3}}/>
          <Skeleton variant="rectangular" width={750} height={80} sx = {{mb: 3}}/>
          <Divider sx = {{mb: 3}}/>
          <Skeleton variant="rectangular" width={200} height={30} sx = {{mb: 3}}/>
          <Skeleton variant="rectangular" width={750} height={80} sx = {{mb: 3}}/>
          <Divider sx = {{mb: 3}}/>
          <Skeleton variant="rectangular" width={200} height={30} sx = {{mb: 3}}/>
          <Skeleton variant="rectangular" width={750} height={80} sx = {{mb: 3}}/>
          <Divider sx = {{mb: 3}}/>
        </div>
        }
        
        {loading === false &&
        <div>
        {Object.values(formData).map((data, index) => 
            <FormControl fullWidth required>
              <Typography sx={{mb: 1, mt: 3, fontWeight: 'bold', fontStyle: 'underlined'}} color="text.secondary">{index + 1}. {data.Question}*</Typography>
              {(function () {
                switch (data.inputType) {
                  case 'text':
                    return (
                      <TextField 
                        key = {data.QuestionID}
                        variant="outlined"
                        sx = {{mt: 0, pt: 0, mb: 5}}
                        required
                        value={answers[data.QuestionID] || ''}
                        margin="normal"
                        onChange = {e => setAnswers(Object.assign({}, answers, { [data.QuestionID]: e.target.value }))}
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
                        value={answers[data.QuestionID] || ''}
                        onChange = {e => setAnswers(Object.assign({}, answers, { [data.QuestionID]: e.target.value }))}
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
        <Button 
          variant="contained"
          sx = {{mt: 3}} 
          onClick={handleSubmit} 
          disabled={!isValid()}
        >
          Submit
        </Button>
        </div>
      }
      </Box>
    </Container>
    </Grow>
  )
};
  
export default Questionnaire;
