import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
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
    <div>Loading...</div>
  ) : !user ? (
    <Navigate to="/login" replace />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
