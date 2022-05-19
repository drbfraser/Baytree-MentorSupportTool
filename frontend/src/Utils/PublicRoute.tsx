import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const [loading, setLoading] = useState(true);
  const { userId, verifyClient } = useAuth();

  useEffect(() => {
    verifyClient();
    setLoading(false);
  }, [verifyClient]);

  return loading ? (
    <div>Loading...</div>
  ) : userId ? (
    <Navigate to="dashboard/home" replace />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
