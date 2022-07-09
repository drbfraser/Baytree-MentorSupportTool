import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { goalsApi } from "../api/goals";
import { userApi } from "../api/mentorAccount";
import { baseApi } from "../api/misc";
import { notificationApi } from "../api/notification";
import { viewsApi } from "../api/views";
import Loading from "../Components/shared/Loading";
import { useAuth } from "../context/AuthContext";
import useRefreshToken from "../hooks/useRefreshToken";

// User must log in before accessing PrivateRoutes
// If not, the routes automatically redirect to the login page
const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const { user, verifyClient } = useAuth();

  // Use refresh token on these private API
  // in the case of expired access token
  useRefreshToken(baseApi);
  useRefreshToken(userApi);
  useRefreshToken(viewsApi);
  useRefreshToken(goalsApi);
  useRefreshToken(notificationApi);

  useEffect(() => {
    verifyClient();
    setLoading(false);
  }, []);

  return loading ? (
    <Loading />
  ) : !user ? (
    <Navigate to="/login" replace />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
