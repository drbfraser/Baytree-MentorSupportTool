export const API_BASE_URL =
  (import.meta.env.DEV ? `http://${window.location.hostname}:8000` : "") +
  "/api";
