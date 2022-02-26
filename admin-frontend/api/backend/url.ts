const isDevelopment = process.env.NODE_ENV === "development";
// Next.js uses server-side rendering, so we can only access `window` if this is running client side
const isClient = typeof window !== "undefined";
export const API_BASE_URL = (isDevelopment && isClient ? `http://${window.location.hostname}:8000` : "") + "/api";
