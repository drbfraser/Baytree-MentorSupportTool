import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// User must log out before accessing PublicRoutes
// If not, the routes automatically redirect to the dashboard home page
const PublicRoute = () => {
  const [loading, setLoading] = useState(true);
  const { user, verifyClient } = useAuth();

  useEffect(() => {
    verifyClient();
    setLoading(false);
  }, [verifyClient]);

  return loading ? (
    <div>Loading...</div>
  ) : user ? (
    <Navigate to="dashboard/home" replace />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
