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
  error = 'error',
}

// Custom Logger class to create logs that will be sent to /logging
export class Logger {
  message: string
  logLevel: logLevel
  displayStackTrace: boolean
  stackTrace: any
  timeStamp: any
  jsonLog: any
  plainLog: any

  constructor(message: string, logLevel: logLevel, displayStackTrace = false) {
    this.message = message
    this.logLevel = logLevel
    this.displayStackTrace = displayStackTrace
    this.timeStamp = Date.now()
    this.getStackTrace()
    this.createJsonLog()
    try {
      this.sendLog()
    }
    catch (error) {
      console.log(error)
    }
  }
  
  getStackTrace() {
    try {
      throw new Error()
    } catch (trace: any) {
      this.stackTrace = trace.stack
    }
  }

 createJsonLog () {
    const jsonLog = {
      message: this.message, 
      level: this.logLevel,
      timeStamp: this.timeStamp,
      stackTrace: this.displayStackTrace ? this.stackTrace : '',
    }
    this.jsonLog = JSON.stringify(jsonLog)
 }

  sendLog = () => {
    return loggingApi.post('', this.jsonLog)
  }
}
