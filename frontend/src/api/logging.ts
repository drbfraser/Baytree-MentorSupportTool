import axios from 'axios'
import { API_BASE_URL } from './url'

// Logging endpoint
const loggingUrl = `${API_BASE_URL}/logging/`

// Create axios configuration
const loggingApi = axios.create({
  baseURL: loggingUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export enum logLevel {
  info = 'info',
  debug = 'debug',
  warning = 'warning',
  critical = 'critical',
  error = 'error'
}

// Custom Logger class to create logs that will be sent to /logging
export class Logger {
  private getStackTrace() {
    try {
      throw new Error()
    } catch (trace: any) {
      return trace.stack
    }
  }

  private createJsonLog(
    message: string,
    logLevel: logLevel,
    displayStackTrace = false
  ) {
    return {
      message: message,
      level: logLevel,
      timeStamp: Date.now(),
      stackTrace: displayStackTrace ? this.getStackTrace() : ''
    }
  }

  sendLog = async (
    message: string,
    logLevel: logLevel,
    displayStackTrace = false
  ) => {
    const jsonLog = this.createJsonLog(message, logLevel, displayStackTrace)
    return await loggingApi
      .post('', jsonLog)
      .catch((error) => alert(error.message))
  }
}
