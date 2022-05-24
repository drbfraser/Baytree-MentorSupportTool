import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import CreateAccount from "./Components/CreateAccount";
import Dashboard from "./Components/Dashboard";
import Goals from "./Components/Goals";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Notification from "./Components/Notification";
import Profile from "./Components/Profile";
import Questionnaire from "./Components/Questionnaire";
import Records from "./Components/Records";
import ResetPassword from "./Components/ResetPassword";
import Sessions from "./Components/Sessions";
import AuthRoute from "./Utils/PrivateRoute";
import PublicRoute from "./Utils/PublicRoute";

function App() {
  return (
    <>
      <ToastContainer></ToastContainer>
      <BrowserRouter>
        <Routes>
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<AuthRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="home" element={<Home />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="questionnaires" element={<Questionnaire />} />
              <Route path="goals" element={<Goals />} />
              <Route path="records" element={<Records />} />
              <Route path="notifications" element={<Notification />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route
              path="/"
              element={<Navigate to="/dashboard/home" replace />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <div id="modalContainer"></div>
    </>
  );
}

export default App;
