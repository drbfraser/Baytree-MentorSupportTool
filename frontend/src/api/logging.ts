import log from 'loglevel';
import remote from 'loglevel-plugin-remote';

const logJsonFormat = (log: { message: any; level: { label: any; }; timestamp: any; stacktrace: any; }) => ({
 msg: log.message,
 level: log.level.label,
 timetamp: log.timestamp,
 stacktrace: log.stacktrace
});

log.enableAll();

const loggingBackendEndpoint = `logging/`;

remote.apply(log, { 
    format: logJsonFormat,
    method: 'POST', 
    url: loggingBackendEndpoint 
});

export default log;

// log.enableAll();

// TODO: TEST THIS