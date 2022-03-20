import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { MOBILE_BREAKPOINT } from "../constants/constants";
import BaytreeLogo from "../Assets/baytree-logo.png";
import BaytreePhoto from "../Assets/baytree-photo.jpg";
import { createMentorAccount } from "../api/mentorAccount";
import { ToastContainer, toast } from "react-toastify";

const CreateAccount = (props: any) => {
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [accountCreationSuccessful, setAccountCreationSuccessful] =
    useState(false);

  const createAccount = async () => {
    const params = new URLSearchParams(window.location.search);
    const accountCreationLinkId = params.get("id");
    if (accountCreationLinkId) {
      const errorMessage =
        "Failed to create mentor account. Please contact an administrator for further assistance.";
      try {
        const apiRes = await createMentorAccount(
          password,
          accountCreationLinkId
        );
        if (apiRes.status === 200) {
          setAccountCreationSuccessful(true);
        } else {
          toast.error(errorMessage);
        }
      } catch {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <PageLayout>
      <CardLayout>
        <Logo>
          <img
            src={BaytreeLogo}
            style={{
              height: "auto",
              width: "11rem",
            }}
            alt="Logo"
          />
        </Logo>
        <PasswordEntry>
          {accountCreationSuccessful ? (
            <Typography variant="h4">Successfully created account!</Typography>
          ) : (
            <>
              <Typography variant="h4">
                Create your account password:
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
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password (again)"
                label="Password (again)"
                type="password"
                id="password-again"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
              />
            </>
          )}
        </PasswordEntry>
        <CreateAccountButton>
          {accountCreationSuccessful ? (
            <Button
              variant="contained"
              onClick={createAccount}
              size="large"
              color="success"
            >
              Login
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={createAccount}
              size="large"
              color="success"
            >
              Create Account!
            </Button>
          )}
        </CreateAccountButton>
        <Photo>
          <img
            src={BaytreePhoto}
            alt="Photo"
            style={{
              objectFit: "cover",
              maxHeight: "95vh",
              height: "auto",
              width: "100%",
              boxShadow: "0 0 0.3rem grey",
            }}
          />
        </Photo>
      </CardLayout>
      <ToastContainer></ToastContainer>
    </PageLayout>
  );
};

const PageLayout = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  height: auto;
  justify-content: center;
  align-items: center;
  background: #f3f5f9;
`;

const CardLayout = styled.div`
  display: grid;
  width: 85vw;
  height: auto;
  box-shadow: 0 0 0.7rem 0.3rem lightgrey;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 5rem;
  grid-gap: 2rem;
  background: white;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "Logo Photo"
    "PasswordEntry Photo"
    "CreateAccountButton Photo";

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100vw;
    min-height: 100vh;
    padding: 0;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "Photo"
      "Logo"
      "PasswordEntry"
      "CreateAccountButton";
  }
`;

const Photo = styled.div`
  width: 100%;
  height: 100%;
  grid-area: Photo;
  display: flex;
  justify-content: center;
  align-items: center;

  @media all and (max-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }
`;

const Logo = styled.div`
  width: 100%;
  height: 100%;
  grid-area: Logo;
  display: flex;
  justify-content: center;
`;

const PasswordEntry = styled.div`
  width: 100%;
  height: 100%;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 2rem;
  grid-area: PasswordEntry;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const CreateAccountButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-area: CreateAccountButton;
`;

export default CreateAccount;
