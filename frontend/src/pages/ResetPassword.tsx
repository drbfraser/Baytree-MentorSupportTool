import PasswordValidation, {
  isValid
} from '@components/shared/PasswordValidation'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material'
import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { resetPassword, userApi } from '../api/mentorAccount'

const usePasswordResetLink = () => {
  const params = useParams()
  const id = params.resetPasswordId!
  const [loading, setLoading] = useState(false)
  const [hardError, setHardError] = useState('')

  const handleError = (hardError: AxiosError, submitting?: boolean) => {
    const code = hardError.response?.status
    if (!code || code === 500) setHardError('An error has occurred')
    if (code === 401) setHardError('Invalid link')
    else if (code === 410) setHardError('Link expired')
    else if (submitting) {
      toast.error(
        'Failed to reset password. Please try again or contact an administrator for further assistance.'
      )
    }
  }

  useEffect(() => {
    setLoading(true)
    userApi
      .post('verifyResetPasswordLink', { id })
      .catch(handleError)
      .finally(() => setLoading(false))
    return () => toast.dismiss()
  }, [])

  const handleResetPassword = (password: string) => {
    setLoading(true)
    return resetPassword(password, id)
      .then(() => true)
      .catch((hardError: AxiosError) => {
        handleError(hardError, true)
        return false
      })
  }

  return { id, loading, hardError, handleResetPassword }
}

const ResetPassword = () => {
  const { loading, hardError, handleResetPassword } = usePasswordResetLink()
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  if (success)
    return (
      <Box width="100%" display="flex" flexDirection="column">
        <Alert severity="success">Successfully reset password</Alert>
        <Button
          sx={{ my: 2 }}
          variant="outlined"
          onClick={() => navigate('/login', { replace: true })}
        >
          To login page
        </Button>
      </Box>
    )

  if (hardError)
    return (
      <Alert severity="error" sx={{ width: '100%' }}>
        <AlertTitle>{hardError}</AlertTitle>
        Please try again or contact the adminstrator for further assistance.
      </Alert>
    )

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setSuccess(await handleResetPassword(password))
      }}
    >
      <Typography width="100%" variant="h6">
        Reset password
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        value={password}
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password (again)"
        type="password"
        value={passwordAgain}
        autoComplete="current-password"
        onChange={(e) => setPasswordAgain(e.target.value)}
        disabled={loading}
      />
      <PasswordValidation password={password} passwordAgain={passwordAgain} />
      <LoadingButton
        type="submit"
        loading={loading}
        disabled={loading || !isValid(password, passwordAgain)}
        fullWidth
        variant="contained"
        color="primary"
      >
        Reset Password
      </LoadingButton>
    </form>
  )
}

export default ResetPassword
