import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/dashboard/Dashboard";
import CreateAccount from "./Components/forms/CreateAccount";
import Login from "./Components/forms/Login";
import ResetPasswordRequest from "./Components/forms/ResetPassword";
import ResetPasswordEmail from "./Components/forms/ResetPasswordRequest";
import Goals from "./Components/goals/Goals";
import Home from "./Components/home/Home";
import Notification from "./Components/Notification";
import Profile from "./Components/Profile";
import Questionnaire from "./Components/questionnaire/Questionnaire";
import Records from "./Components/records/Records";
import Sessions from "./Components/sessions/Sessions";
import PublicLayout from "./Components/shared/PublicLayout";
import PrivateRoute from "./Utils/PrivateRoute";
import PublicRoute from "./Utils/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/resetPassword">
            <Route path="" element={<ResetPasswordEmail />} />
            <Route path=":resetPasswordId" element={<ResetPasswordRequest />} />
          </Route>
          <Route path="/createAccount/:accountCreationId" element={<CreateAccount />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="home" element={<Home />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="questionnaires" element={<Questionnaire />} />
            <Route path="goals" element={<Goals />} />
            <Route path="records" element={<Records />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
        </Route>

        {/* If the path is not found, redirect to the root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
