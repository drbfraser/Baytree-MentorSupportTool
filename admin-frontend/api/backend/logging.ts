import log from 'loglevel';
var remote = require('loglevel-plugin-remote');

const customJSON = (log: { message: any; level: { label: any; }; stacktrace: any; }) => ({
 msg: log.message,
 level: log.level.label,
 stacktrace: log.stacktrace
});

remote.apply(log, { format: customJSON, url: '/logger' });

log.enableAll();

log.info('Message one');
log.warn('Message two');