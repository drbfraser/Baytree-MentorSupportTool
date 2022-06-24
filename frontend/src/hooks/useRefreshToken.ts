import { AxiosError, AxiosInstance } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../api/auth";

const useRefreshToken = (api: AxiosInstance) => {
  const navigate = useNavigate();
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        console.log("Intercepting...");
        const prevRequest = error.config;
        // Check for unauthorized error
        if (prevRequest && error.response?.status === 401) {
          // Refesh the access token
          const refreshed = await refreshAccessToken();

          // Resend the request if refresh was sucessful
          if (refreshed) return api(prevRequest);

          // Navigate back to login page for expired refresh token
          else return navigate("/login");
        }
        return error;
      }
    )
    return () => {
      console.log("Ejecting...")
      api.interceptors.response.eject(interceptor);
    }
  }, [])
};

export default useRefreshToken;