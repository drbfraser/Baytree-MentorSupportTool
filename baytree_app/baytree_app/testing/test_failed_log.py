from baytree_app.FluentLoggingHandler import FluentLoggingHandler
import logging

# log file formatter
formatter = logging.Formatter(
    '%(asctime)s - %(levelname)s - %(message)s')

# message logger setup
FluentLoggingHandler.messageLogger.setLevel(logging.DEBUG)
applicationFileHandler = logging.FileHandler(
    "/builds/415-baytree/mentorsupport/baytree_app/server_logs/server_application.log")
applicationFileHandler.setFormatter(formatter)
FluentLoggingHandler.messageLogger.addHandler(applicationFileHandler)

# sending critical log
FluentLoggingHandler.critical("A fluent logger test has failed")

# cleanup handler
FluentLoggingHandler.messageLogger.removeHandler(applicationFileHandler)
