import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      light: '#cfe0bb',
      main: '#5ab801'
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
  }
});