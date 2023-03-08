import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { sendPasswordResetEmail } from '../api/mentorAccount'

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const requestResetPasswordEmail = () => {
    setLoading(true)
    sendPasswordResetEmail(email)
      .then(() => setSuccess(true))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  if (success) {
    return (
      <Alert severity="success" sx={{ width: '100%' }}>
        <AlertTitle>Password reset email has been sent</AlertTitle>
        Please check your inbox for further instruction
      </Alert>
    )
  }

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={(e) => {
        e.preventDefault()
        requestResetPasswordEmail()
      }}
    >
      <Typography variant="h6">Enter your email</Typography>
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          <AlertTitle>Failed to send password reset email</AlertTitle>
          Please try again or contact the administrator for further assistance
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        name="email"
        label="Email"
        autoComplete="email"
        value={email}
        autoFocus
        onChange={(e) => setEmail(e.target.value)}
      />
      <LoadingButton
        type="submit"
        value="Login"
        disabled={!email || loading}
        fullWidth
        variant="contained"
        color="primary"
        loading={loading}
        sx={{ mt: 3 }}
      >
        Send reset password email
      </LoadingButton>
    </form>
  )
}

export default ResetPasswordRequest
