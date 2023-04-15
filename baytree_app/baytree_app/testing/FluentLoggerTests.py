from baytree_app.FluentLoggingHandler import FluentLoggingHandler
import os
import unittest
import logging
from unittest.mock import MagicMock

# initial setup for tests
# we need to setup the log level and file handler for each logger because they are not setup automatically in testcases
# without this setup, our logging system does not log anything to the log files
# this behaviour seems to be unique to testcases only


class TestFluentLoggingHandler(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # setting paths to log files
        cls.serverApplicationLogPath = os.path.abspath(
            "/builds/415-baytree/mentorsupport/baytree_app/server_logs/server_application.log")
        cls.serverRequestsLogPath = os.path.abspath(
            "/builds/415-baytree/mentorsupport/baytree_app/server_logs/server_requests.log")

        # log file formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s')

        # message logger setup
        FluentLoggingHandler.messageLogger.setLevel(logging.DEBUG)
        cls.applicationFileHandler = logging.FileHandler(
            cls.serverApplicationLogPath)
        cls.applicationFileHandler.setFormatter(formatter)
        FluentLoggingHandler.messageLogger.addHandler(
            cls.applicationFileHandler)

        # request logger setup
        FluentLoggingHandler.requestLogger.setLevel(logging.DEBUG)
        cls.requestsFileHandler = logging.FileHandler(
            cls.serverRequestsLogPath)
        cls.requestsFileHandler.setFormatter(formatter)
        FluentLoggingHandler.requestLogger.addHandler(cls.requestsFileHandler)

    @classmethod
    def tearDownClass(cls):
        FluentLoggingHandler.messageLogger.removeHandler(
            cls.applicationFileHandler)
        FluentLoggingHandler.requestLogger.removeHandler(
            cls.requestsFileHandler)

    def test_logRequest(self):
        # mock request object
        request = MagicMock()
        request.build_absolute_uri = MagicMock(
            return_value='http://baytree.com')
        request.user = "Arshdeep Chhokar"
        request.method = "GET"
        request.GET = {}
        request.META = {"CONTENT_LENGTH": "",
                        "HTTP_ACCEPT": "",
                        "HTTP_REFERER": "",
                        "QUERY_STRING": "",
                        "SERVER_NAME": "",
                        "SERVER_PORT": ""}

        stringified_meta = str({"content_length": "",
                                "http_accept": "",
                                "http_referer": "",
                                "query_string": "",
                                "server_name": "",
                                "server_port": ""})

        FluentLoggingHandler.logRequest(request, "Testing logRequest method")
        with open(self.serverRequestsLogPath, 'r') as f:
            log_contents = f.read()
        self.assertIn("Testing logRequest method", log_contents,
                      "Expected log 'Testing logRequest method' not found in log file")
        self.assertIn(request.user, log_contents,
                      f"Expected log '{request.user}' not found in log file")
        self.assertIn(request.method, log_contents,
                      f"Expected log '{request.method}' not found in log file")
        self.assertIn(stringified_meta, log_contents,
                      f"Expected log '{stringified_meta}' not found in log file")

    def test_logResponse(self):
        # mock response object
        response = MagicMock()
        response.headers = {'Content-Type': ''}
        response.status_code = 200
        # mock request object
        request = MagicMock()
        request.build_absolute_uri = MagicMock(
            return_value='http://baytree.com')
        request.META = {'HTTP_REFERER': ''}

        stringified_meta = str({"content-type": ""})

        FluentLoggingHandler.logResponse(
            response, request, "Testing logResponse method")
        with open(self.serverRequestsLogPath, 'r') as f:
            log_contents = f.read()
        self.assertIn("frontend", log_contents,
                      "Expected log 'frontend' not found in log file")
        self.assertIn("Testing logResponse method", log_contents,
                      "Expected log 'Testing logResponse method' not found in log file")
        self.assertIn("INFO", log_contents,
                      "Expected log 'INFO' not found in log file")
        self.assertIn("http://baytree.com", log_contents,
                      "Expected log 'http://baytree.com' not found in log file")
        self.assertIn(stringified_meta, log_contents,
                      f"Expected log '{stringified_meta}' not found in log file")

    def test_info(self):
        FluentLoggingHandler.info("Testing info level logs")
        with open(self.serverApplicationLogPath, 'r') as f:
            log_contents = f.read()
        expected_log = "Testing info level logs"
        self.assertIn(expected_log, log_contents,
                      f"Expected log '{expected_log}' not found in log file")

    def test_debug(self):
        FluentLoggingHandler.debug("Testing debug level logs")
        with open(self.serverApplicationLogPath, 'r') as f:
            log_contents = f.read()
        expected_log = "Testing debug level logs"
        self.assertIn(expected_log, log_contents,
                      f"Expected log '{expected_log}' not found in log file")

    def test_warning(self):
        FluentLoggingHandler.warning("Testing warning level logs")
        with open(self.serverApplicationLogPath, 'r') as f:
            log_contents = f.read()
        expected_log = "Testing warning level logs"
        self.assertIn(expected_log, log_contents,
                      f"Expected log '{expected_log}' not found in log file")

    def test_error(self):
        FluentLoggingHandler.error("Testing error level logs")
        with open(self.serverApplicationLogPath, 'r') as f:
            log_contents = f.read()
        expected_log = "Testing error level logs"
        self.assertIn(expected_log, log_contents,
                      f"Expected log '{expected_log}' not found in log file")

    def test_critical(self):
        FluentLoggingHandler.critical("Testing critical level logs")
        with open(self.serverApplicationLogPath, 'r') as f:
            log_contents = f.read()
        expected_log = "Testing critical level logs"
        self.assertIn(expected_log, log_contents,
                      f"Expected log '{expected_log}' not found in log file")


if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestFluentLoggingHandler)
    result = unittest.TestResult()
    suite.run(result)
