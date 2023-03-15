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
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createMentorAccount, userApi } from '../api/mentorAccount'

const useAccountCreationLink = () => {
  const params = useParams()
  const id = params?.accountCreationId ?? 'Missing ID'
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [hardError, setHardError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleError = (hardError: AxiosError, submitting?: boolean) => {
    const code = hardError.response?.status
    if (!code || code === 500) setHardError('An error has occurred')
    if (code === 401) setHardError('Invalid link')
    else if (code === 410) setHardError('Link expired')
    else if (submitting) {
      toast.error(
        'Failed to create an account. Please try again or contact an administrator for further assistance.'
      )
    }
  }

  useEffect(() => {
    setIsPageLoading(true)
    userApi
      .post('verifyAccountCreationLink', { id })
      .catch(handleError)
      .finally(() => setIsPageLoading(false))
    return () => toast.dismiss()
  }, [])

  const createAccount = (password: string) => {
    setIsPageLoading(true)
    createMentorAccount(password, id)
      .then(() => setSuccess(true))
      .catch((error: AxiosError) => {
        handleError(error, true)
        setSuccess(false)
      })
      .finally(() => setIsPageLoading(false))
  }

  return { isPageLoading, hardError, createAccount, success }
}

const CreateAccount = () => {
  const { isPageLoading, hardError, createAccount, success } =
    useAccountCreationLink()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [showModal, setShowModal] = useState(false)

  if (success) {
    return (
      <Box width="100%" display="flex" flexDirection="column">
        <Alert severity="success">Successfully created account!</Alert>
        <Button
          sx={{ my: 2 }}
          variant="outlined"
          onClick={() => navigate('/login', { replace: true })}
        >
          To login page
        </Button>
      </Box>
    )
  }

  if (hardError)
    return (
      <Alert severity="error" sx={{ width: '100%' }}>
        <AlertTitle>{hardError}</AlertTitle>
        Please try again or contact the adminstrator for further assistance.
      </Alert>
    )

  return (
    <>
      <form
        style={{ width: '100%' }}
        onSubmit={(e) => {
          e.preventDefault()
          setShowModal(true)
        }}
      >
        <Typography width="100%" variant="h6">
          Create your account password
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="passwordAgain"
          label="Password (again)"
          type="password"
          id="password"
          value={passwordAgain}
          autoComplete="current-password"
          onChange={(e) => setPasswordAgain(e.target.value)}
        />
        {/* Validation fields */}
        <PasswordValidation password={password} passwordAgain={passwordAgain} />
        <LoadingButton
          type="submit"
          value="Login"
          disabled={!isValid(password, passwordAgain) || isPageLoading}
          fullWidth
          variant="contained"
          color="primary"
          loading={isPageLoading}
        >
          Create Account
        </LoadingButton>
      </form>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Data Protection Privacy
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Our Data Protection Privacy statement explains how we look after
            your information and what we do with it, you can find a copy on our
            website or by asking a member of staff. We will save the information
            you provide on our systems, which are accessible to all our staff.
            Generally, the information you provide us will be treated as
            confidential amongst our staff, however, in certain circumstances,
            we may need to disclose some information to third parties
            (including, for example, the social services). By accessing our
            services, you confirm that you consent to the storage and use of
            your data.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button
            color="error"
            onClick={() => {
              setShowModal(false)
            }}
          >
            Disagree
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowModal(false)
              createAccount(password)
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CreateAccount
