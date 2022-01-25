import { Button, Grid, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <Grid
          item
          xs={8}
          style={{ height: "100%", width: "100%" }}
        >
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
            type="submit"
            value="Login"
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 3, mb: 2 }}
          >
            {" "}
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
