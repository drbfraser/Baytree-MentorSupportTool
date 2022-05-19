import React, { useState, useEffect } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import Logo from "../assets/baytree-logo.png";
import Photo from "../assets/baytree-photo.jpg";
import { CardContent } from "@mui/material";
import { login, verify } from "../api/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyClient() {
      if (await verify()) {
        window.location.replace("/dashboard/home");
      } else {
        setLoading(false);
      }
    }

    verifyClient();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let loginRes;

    if ((loginRes = await login(email, password))) {
      localStorage.setItem("user_id", loginRes.user_id);
      window.location.replace("/dashboard/home");
    } else {
      setEmail("");
      setPassword("");
      setErrors(true);
    }
  };

  return (
    <div className="content">
      <Grid container component="main" sx={{ height: "95vh" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Photo})`,
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <Grid item xs={12} sm={8} md={5}>
          <Card>
            <CardContent style={{ padding: "60px", height: "81vh" }}>
              {loading === false && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  margin="30px"
                >
                  <img src={Logo} alt="Logo" width="null" height="200" />
                </Box>
              )}
              {errors === true && (
                <Alert severity="warning">Invalid email or password</Alert>
              )}
              {loading === false && (
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
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
                    <a href="/ResetPassword">Forgot Password?</a>
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
