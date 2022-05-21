import { ThemeProvider } from "@mui/material";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { theme } from "./Utils/theme";

ReactDOM.render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </AuthProvider>,
  document.getElementById("root")
);
