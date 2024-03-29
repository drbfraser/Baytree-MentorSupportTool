import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Logo from '../Assets/baytree-logo.png'
import Photo from '../Assets/baytree-photo.jpg'

const PublicLayout = () => {
  return (
    <Box
      display="flex"
      alignItems="stretch"
      justifyContent="center"
      component="main"
      minHeight="100vh"
    >
      <Box
        flexGrow={1}
        sx={{
          backgroundImage: `url(${Photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        padding="30px"
        sx={{
          width: {
            xs: '100%',
            sm: '100%',
            md: '450px'
          }
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          width="null"
          height="200"
          style={{ marginBottom: '30px' }}
        />
        <Outlet />
      </Box>
    </Box>
  )
}

export default PublicLayout
