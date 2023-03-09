from baytree_app.FluentLoggingHandler import FluentLoggingHandler
import os
import unittest
import logging

# initial setup for tests
# we need to setup the log level and file handler because they are not setup automatically for each testcase
# without this setup, our logging system does not log anything to the log files
# this behaviour seems to be unique to testcases only
serverApplicationLogPath = os.path.abspath(
    "/code/server_logs/server_application.log")
serverRequestsLogPath = os.path.abspath(
    "/code/server_logs/server_requests.log")
FluentLoggingHandler.messageLogger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler(serverApplicationLogPath)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)


class TestFluentLoggingHandler(unittest.TestCase):
    def setUp(self):
        FluentLoggingHandler.messageLogger.addHandler(file_handler)

    def tearDown(self):
        FluentLoggingHandler.messageLogger.removeHandler(file_handler)

    def test_info(self):
        FluentLoggingHandler.info("Testing info level logs")
        with open(serverApplicationLogPath, 'r') as f:
            log_contents = f.read()
        self.assertIn("Testing info level logs", log_contents)

    def test_debug(self):
        FluentLoggingHandler.debug("Testing debug level logs")
        with open(serverApplicationLogPath, 'r') as f:
            log_contents = f.read()
        self.assertIn("Testing debug level logs", log_contents)

    def test_warning(self):
        FluentLoggingHandler.warning("Testing warning level logs")
        with open(serverApplicationLogPath, 'r') as f:
            log_contents = f.read()
        self.assertIn("Testing warning level logs", log_contents)

    def test_error(self):
        FluentLoggingHandler.error("Testing error level logs")
        with open(serverApplicationLogPath, 'r') as f:
            log_contents = f.read()
        self.assertIn("Testing error level logs", log_contents)

    def test_critical(self):
        FluentLoggingHandler.critical("Testing critical level logs")
        with open(serverApplicationLogPath, 'r') as f:
            log_contents = f.read()
        self.assertIn("Testing critical level logs", log_contents)


suite = unittest.TestSuite()
suite.addTest(TestFluentLoggingHandler('test_info'))
suite.addTest(TestFluentLoggingHandler('test_debug'))
suite.addTest(TestFluentLoggingHandler('test_warning'))
suite.addTest(TestFluentLoggingHandler('test_critical'))
suite.addTest(TestFluentLoggingHandler('test_error'))

if __name__ == '__main__':
    unittest.TextTestRunner().run(suite)
