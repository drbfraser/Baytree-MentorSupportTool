import log from 'loglevel';
import remote from 'loglevel-plugin-remote';
import { API_BASE_URL } from "./url";

const logJsonFormat = (log: { message: any; level: { label: any; }; timestamp: any; stacktrace: any; }) => ({
 msg: log.message,
 level: log.level.label,
 timetamp: log.timestamp,
 stacktrace: log.stacktrace
});

log.enableAll();

const loggingUrl = `${API_BASE_URL}/logging/`;

remote.apply(log, { 
    format: logJsonFormat,
    method: 'POST', 
    url: loggingUrl 
});

export default log;
