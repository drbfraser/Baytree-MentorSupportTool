import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import { BODY_BACKGROUND } from "../constants/constants";
import useMobileLayout from "../hooks/useMobileLayout";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../actions/auth/actionCreators";
import { RootState } from "../stores/store";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);
  const router = useRouter();
  const mobileLayout = useMobileLayout();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector<RootState, boolean>(
    (state) => state.auth.isAuthenticated
  );

  const onSignIn = async () => {
    if (dispatch && dispatch !== null && dispatch !== undefined) {
      await dispatch(login(email, password));
      if (!isAuthenticated) {
        setErrors(true);
      }
    }
  };

  if (isAuthenticated) {
    router.push("/home");
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: mobileLayout ? "white" : BODY_BACKGROUND,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {mobileLayout ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
          }}
        >
          <BackgroundPhoto></BackgroundPhoto>
          <BaytreeLogo></BaytreeLogo>
          <LoginForm
            errors={errors && !isAuthenticated}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSignIn={onSignIn}
          ></LoginForm>
        </div>
      ) : (
        <Grid
          container
          style={{
            width: "95vw",
            height: "95vh",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 0 0.3rem grey"
          }}
        >
          <Grid item xs={8} style={{display: "flex", alignItems: "center", height: "100%", width: "100%", padding: "2rem" }}>
            <img
              src="/admin/images/login/photo.jpg"
              style={{
                objectFit: "cover",
                maxHeight: "95vh",
                height: "auto",
                width: "100%",
                borderRadius: "20px",
                boxShadow: "0 0 0.3rem grey",
              }}
              alt="Login background photo"
            ></img>
          </Grid>
          <Grid item xs={4} padding="2rem">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="/admin/images/baytree-logo.svg"
                style={{ width: "200px", height: "200px" }}
                alt="Baytree logo"
              ></img>
            </div>
            <Typography variant="h4" padding="1rem" align="center">
              Admin Login
            </Typography>
            {errors && !isAuthenticated && (
              <Alert severity="warning">Failed to login.</Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
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
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              onClick={onSignIn}
            >
              Sign In
            </Button>

            <Typography variant="caption" display="block" align="center">
              <a href="http://localhost:3000/ResetPassword">Forgot Password?</a>
            </Typography>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

const BackgroundPhoto: React.FC<{}> = () => {
  return (
    <BackgroundPhotoContainer>
      <StyledBackgroundPhoto src="/admin/images/login/photo.jpg"></StyledBackgroundPhoto>
    </BackgroundPhotoContainer>
  );
};

const BackgroundPhotoContainer = styled.div``;

const StyledBackgroundPhoto = styled.img`
  object-fit: fill;
  height: auto;
  width: 100%;
`;

const BaytreeLogo: React.FC<{}> = () => {
  return (
    <BaytreeLogoContainer>
      <LogoCircleContainer>
        <StyledBaytreeLogo src="/admin/images/baytree-logo.svg"></StyledBaytreeLogo>
      </LogoCircleContainer>
    </BaytreeLogoContainer>
  );
};

const BaytreeLogoContainer = styled.div`
  background: white;
  display: flex;
  justify-content: center;
  height: 2rem;
`;

const LogoCircleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  background: white;
  position: relative;
  top: -5.5rem;
  border-radius: 9000px;
  width: 10rem;
  height: 10rem;
  padding: 1rem;
  border: 2px solid lightgrey;
`;

const StyledBaytreeLogo = styled.img`
  width: 7rem;
  height: 7rem;
`;

interface LoginFormProps {
  errors: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSignIn: () => void;
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
  return (
    <StyledLoginForm>
      <Typography variant="h4" padding="1rem" align="center">
        Admin Login
      </Typography>
      {props.errors && (
        <Alert severity="warning">Failed to login.</Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={props.email}
        autoFocus
        onChange={(e) => props.setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        value={props.password}
        autoComplete="current-password"
        onChange={(e) => props.setPassword(e.target.value)}
      />
      <Button
        fullWidth
        variant="contained"
        color="success"
        sx={{ mt: 3, mb: 2 }}
        onClick={props.onSignIn}
      >
        Sign In
      </Button>

      <Typography variant="caption" display="block" align="center">
        <a href="http://localhost:3000/ResetPassword">Forgot Password?</a>
      </Typography>
    </StyledLoginForm>
  );
};

const StyledLoginForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

export default Login;
