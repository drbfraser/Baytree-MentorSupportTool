import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const Profile = () => {
    return (
      <Container 
        maxWidth = "md" 
        sx = {{border: 0.1, boxShadow: 2, borderRadius: 5, pt: 2, mt: 3}}
        style={{ background: '#ffffff' }}>
        <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
          {localStorage.getItem('firstname')} {localStorage.getItem('lastname')}
        </Typography>
        <Divider />





        
      </Container>
    )
  };
  
  export default Profile;