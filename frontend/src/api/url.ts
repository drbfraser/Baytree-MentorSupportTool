const isDevelopment = process.env.NODE_ENV === "development";
export const API_BASE_URL = (isDevelopment ? `http://${window.location.hostname}:8000` : "") + "/api";
