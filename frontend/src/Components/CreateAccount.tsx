import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, Button, TextField, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FunctionComponent, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { createMentorAccount } from "../api/mentorAccount";

const ValidationMessage: FunctionComponent<{ label: string, validated: boolean }> = ({ label, validated }) => {
  return <Box display="flex" alignItems="center">
    {validated ? <CheckCircleIcon color="primary" fontSize="small" sx={{ m: 0.5 }} /> : <ErrorIcon color="error" fontSize="small" sx={{ m: 0.5 }} />}
    <Typography variant="subtitle2" color={validated ? "primary" : "error"}>{label}</Typography>
  </Box>
}

const CreateAccount = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setIsPageLoading(true);
    setShowModal(true);
  };

  async function createAccount() {
    const params = new URLSearchParams(window.location.search);
    const accountCreationLinkId = params.get("id");

    if (accountCreationLinkId) {
      try {
        setShowModal(false);
        const apiRes = await createMentorAccount(
          password,
          accountCreationLinkId
        );

        if (apiRes.status === 200) {
          toast.success("Account created successfully!");
          navigate("/login");
        } else if (apiRes.status === 410) {
          toast.error(
            "Link expired. Please contact an administrator for further assistance."
          );
        } else {
          toast.error(
            "Invalid link. Please contact an administrator for further assistance."
          );
        }
      } catch {
        toast.error(
          "Failed to create mentor account. Please contact an administrator for further assistance."
        );
      } finally {
        setIsPageLoading(false);
      }
    }
  }

  function modalAgreeClick() {
    setShowModal(false);
    setIsPageLoading(false);
    createAccount();
  }

  function modalDisagreeClick() {
    setShowModal(false);
    setIsPageLoading(false);
  }

  const hasValidLength = password.length >= 8 && password.length <= 30;
  const containsNumber = /\d/.test(password);
  const containsLowercase = /[a-z]/.test(password);
  const containsUppercase = /[A-Z]/.test(password);
  const containsSpecial = /\W/.test(password);
  const isMatch = password === passwordAgain;
  const valid = hasValidLength && containsNumber && containsLowercase && containsUppercase && containsSpecial && isMatch;

  return (
    <>
      <form onSubmit={(e) => {
        e.preventDefault();
        openModal();
      }}>
        <Typography width="100%" variant="h6">Create your account password</Typography>
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
        <Box padding={1} sx={{ backgroundColor: "rgba(0, 0, 0, 0.05)", my: 2 }}>
          <ValidationMessage validated={hasValidLength} label="Contains 8 - 30 characters" />
          <ValidationMessage validated={containsNumber} label="Contains at least one number" />
          <ValidationMessage validated={containsLowercase} label="Contains at least one lowercase letter" />
          <ValidationMessage validated={containsUppercase} label="Contains at least one uppercase letter" />
          <ValidationMessage validated={containsSpecial} label="Contains at least one special character" />
          <ValidationMessage validated={isMatch} label="Passwords match" />
        </Box>
        <Button
          type="submit"
          value="Login"
          disabled={!valid || isPageLoading}
          fullWidth
          variant="contained"
          color="primary"
        >
          Create Account
        </Button>
      </form>
      <Dialog
        open={showModal}
        onClose={modalDisagreeClick}
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
            onClick={modalDisagreeClick}
          >
            Disagree
          </Button>
          <Button
            variant='contained'
            onClick={modalAgreeClick}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateAccount;
