import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);
  const router = useRouter();

  const onSignIn = () => {
    const user = {
      email: email,
      password: password,
    };

    fetch("http://localhost:8000/rest-auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.key) {
          localStorage.clear();
          localStorage.setItem("token", data.key);
          router.push("/dashboard");
        } else {
          setEmail("");
          setPassword("");
          localStorage.clear();
          setErrors(true);
        }
      });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "lightgrey",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        container
        style={{
          width: "95vw",
          height: "95vh",
          background: "white",
        }}
      >
        <Grid item xs={8} style={{ height: "100%", width: "100%" }}>
          <img
            src="/images/login/photo.jpg"
            style={{ objectFit: "fill", height: "100%", width: "100%" }}
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
              src="/images/baytree-logo.svg"
              style={{ width: "200px", height: "200px" }}
            ></img>
          </div>
          <Typography variant="h4" padding="1rem" align="center">
            Admin Login
          </Typography>
          {errors && (
            <Alert severity="warning">Invalid email or password</Alert>
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
    </div>
  );
};

export default Login;
