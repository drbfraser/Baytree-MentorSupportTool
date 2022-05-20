import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { createMentorAccount } from "../api/mentorAccount";
import BaytreeLogo from "../Assets/baytree-logo.png";
import BaytreePhoto from "../Assets/baytree-photo.jpg";
import { MOBILE_BREAKPOINT } from "../constants/constants";
import { checkPassword } from "../Utils/password";
import OverlaySpinner from "./shared/overlaySpinner";

const CreateAccount = (props: any) => {
  const [password, setPassword] = useState("");
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
  const [passwordAgain, setPasswordAgain] = useState("");
  const [accountCreationSuccessful, setAccountCreationSuccessful] =
    useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const createAccount = async () => {
    const params = new URLSearchParams(window.location.search);
    const accountCreationLinkId = params.get("id");

    if (password !== passwordAgain) {
      setPasswordsDontMatch(true);
      setPasswordInvalid(false);
    } else if (checkPassword(password)) {
      if (accountCreationLinkId) {
        try {
          setIsPageLoading(true);
          const apiRes = await createMentorAccount(
            password,
            accountCreationLinkId
          );
          if (apiRes.status === 200) {
            setIsPageLoading(false);
            setAccountCreationSuccessful(true);
          } else if (apiRes.status === 410) {
            setIsPageLoading(false);
            toast.error(
              "Link expired. Please contact an administrator for further assistance."
            );
          } else {
            setIsPageLoading(false);
            toast.error(
              "Invalid link. Please contact an administrator for further assistance."
            );
          }
        } catch {
          setIsPageLoading(false);
          toast.error(
            "Failed to create mentor account. Please contact an administrator for further assistance."
          );
        }
      }
    } else {
      setPasswordInvalid(true);
      setPasswordsDontMatch(false);
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
              width: "11rem"
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
              {passwordInvalid && (
                <Typography variant="body1" color="red">
                  Error: password should be at least 8 characters, no more than
                  30 characters, and contain at least one number, symbol,
                  lowercase letter, and uppercase letter
                </Typography>
              )}
              {passwordsDontMatch && (
                <Typography variant="body1" color="red">
                  Error: both password fields should match
                </Typography>
              )}
            </>
          )}
        </PasswordEntry>
        <CreateAccountButton>
          {accountCreationSuccessful ? (
            <Button
              variant="contained"
              onClick={() => {
                window.location.replace("/login");
              }}
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
            alt="BaytreeBackground"
            style={{
              objectFit: "cover",
              maxHeight: "95vh",
              height: "auto",
              width: "100%",
              boxShadow: "0 0 0.3rem grey"
            }}
          />
        </Photo>
      </CardLayout>
      <OverlaySpinner active={isPageLoading}></OverlaySpinner>
    </PageLayout>
  );
};

const PageLayout = styled.div`
  display: flex;
  width: 100%;
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
    padding: 0 0 2rem 0;
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
  justify-content: center;
`;

const CreateAccountButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-area: CreateAccountButton;
`;

export default CreateAccount;
