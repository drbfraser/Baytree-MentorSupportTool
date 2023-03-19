import { createTheme } from '@mui/material'

const theme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          color: 'success',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: 'success',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'success',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#5ab801',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff1e89',
    },
  },
})

export default theme
