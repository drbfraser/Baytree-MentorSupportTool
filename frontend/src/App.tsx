import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Dashboard, PrivateRoute, PublicLayout, PublicRoute } from "./layouts";
import { CreateAccount, Goals, Home, Login, Notifications, Profile, Questionnaire, Records, ResetPassword, ResetPasswordRequest, Sessions } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/resetPassword">
            <Route path="" element={<ResetPasswordRequest />} />
            <Route path=":resetPasswordId" element={<ResetPassword />} />
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
            <Route path="notifications" element={<Notifications />} />
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
