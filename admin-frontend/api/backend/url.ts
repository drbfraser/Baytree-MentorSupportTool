// Next.js uses server-side rendering, so we can only access `window` if this is running client side
// if either constant is embedded in JSX, then it must be wrapped in <NoServerSideRender>
const isClient = typeof window !== 'undefined'

const isDevelopment = process.env.NODE_ENV === 'development'

export const API_BASE_URL =
  (isDevelopment && isClient ? `http://${window.location.hostname}:8000` : '') +
  '/api'

export const FRONTEND_BASE_URL =
  isDevelopment && isClient ? `http://${window.location.hostname}:3000` : ''
