import { ThemeProvider } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import { theme } from './Utils/theme'

import { createRoot } from 'react-dom/client'
const root = createRoot(document.getElementById('root')!)
root.render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <ToastContainer autoClose={2000} />
      <App />
    </ThemeProvider>
  </AuthProvider>
)
