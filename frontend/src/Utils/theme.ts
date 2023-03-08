import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#5ab801',
      contrastText: '#fff'
    },
    secondary: {
      main: '#ff1e89'
    }
  },
  typography: {
    fontFamily: 'Fira Sans',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
})
