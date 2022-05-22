import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// User must log in before accessing PrivateRoutes
// If not, the routes automatically redirect to the login page
const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const { userId, verifyClient } = useAuth();

  useEffect(() => {
    verifyClient();
    setLoading(false);
  }, [verifyClient]);

  return loading ? (
    <div>Loading...</div>
  ) : !userId ? (
    <Navigate to="/login" replace />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
