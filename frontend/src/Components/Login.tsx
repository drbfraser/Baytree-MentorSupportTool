import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Assets/baytree-logo.png";
import Photo from "../Assets/baytree-photo.jpg";
import { useAuth } from "../context/AuthContext";

// Main Login Page
const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isLoggedIn = await signIn(email, password);

    if (!isLoggedIn) {
      setErrors(true);
      setEmail("");
      setPassword("");
    } else {
      navigate("/dashboard/home", { replace: true });
    }
  };

  return (
    <>
      <Box display="flex" alignItems="stretch" justifyContent="center" component="main" minHeight="100vh">
        <Box
          flexGrow={1}
          sx={{
            backgroundImage: `url(${Photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" padding="30px" sx={{
          width: {
            xs: "100%",
            sm: "100%",
            md: "450px"
          }
        }}>
          <img src={Logo} alt="Logo" width="null" height="200" style={{ marginBottom: "30px" }} />
          <Typography width="100%" variant="h6">Log in to Baytree Mentor Portal</Typography>
          <form noValidate onSubmit={handleSubmit}>
            {errors && (
              <Alert severity="warning" sx={{my: 1}}>Invalid email or password</Alert>
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
              type="submit"
              value="Login"
              disabled={!email || !password}
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Log in
            </Button>
            <Typography variant="caption" display="block" align="center">
              <a href="/ResetPassword">Forgot Password?</a>
            </Typography>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Login;
