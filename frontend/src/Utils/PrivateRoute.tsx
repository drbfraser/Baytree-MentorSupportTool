import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../Components/shared/Loading";
import { useAuth } from "../context/AuthContext";

// User must log in before accessing PrivateRoutes
// If not, the routes automatically redirect to the login page
const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const { user, verifyClient } = useAuth();

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
