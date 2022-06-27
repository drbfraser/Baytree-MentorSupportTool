import log from 'loglevel';
var remote = require('loglevel-plugin-remote');

const logJsonFormat = (log: { message: any; level: { label: any; }; stacktrace: any; }) => ({
 msg: log.message,
 level: log.level.label,
 stacktrace: log.stacktrace
});


const loggingBackendEndpoint = `logging/`;

remote.apply(log, { 
    format: logJsonFormat, 
    url: loggingBackendEndpoint 
});

export default log;

// log.enableAll();

// log.info('Message one');
// log.warn('Message two');