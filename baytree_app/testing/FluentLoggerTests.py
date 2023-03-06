from baytree_app.FluentLoggingHandler import FluentLoggingHandler

import unittest
import os

serverApplicationLogPath = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', 'server_logs', 'server_application.log'))
serverRequestsLogPath = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', 'server_logs', 'server_requests.log'))


class TestFluentLoggingHandler(unittest.TestCase):
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
    unittest.TextTestRunner.run(suite)
