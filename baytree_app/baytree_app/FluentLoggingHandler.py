import logging


class FluentLoggingHandler:

    messageLogger = logging.getLogger("django_message")
    requestLogger = logging.getLogger("django.request")

    def __init__(self):
        pass

    def sendInfoLog(self, message):
        pass

    def logRequestReceived(self, request, message="Request Received"):
        try:
            logJson = {"log": {
                "requestingUser": request.user,
                "meta": request.META,
                "isRequestReceivedLog": True,
                "message": message
            }}
            self.requestLogger.info(logJson)

        except Exception as e:
            print(e)

    def logResponseSent(self, response, message="Response Sent"):
        try:
            logJson = {"log": {
                "meta": response.headers,
                "isRequestReceivedLog": False,
                "message": message
            }}
            if response.status_code < 400:
                self.requestLogger.info(logJson)
            elif response.status_code < 600:
                self.requestLogger.error(logJson)
            else:
                # Default is INFO level
                self.requestLogger.info(logJson)

        except Exception as e:
            print(e)

    def debug(self, message=""):
        try:
            logJson = {"log": message}
            self.messageLogger.debug(logJson)
        except Exception as e:
            print(e)

    def info(self, message=""):
        try:
            logJson = {"log": message}
            self.messageLogger.info(logJson)
        except Exception as e:
            print(e)

    def warning(self, message=""):
        try:
            logJson = {"log": message}
            self.messageLogger.warning(logJson)
        except Exception as e:
            print(e)

    def error(self, message=""):
        try:
            logJson = {"log": message}
            self.messageLogger.error(logJson)
        except Exception as e:
            print(e)

    def critical(self, message=""):
        try:
            logJson = {"log": message}
            self.messageLogger.critical(logJson)
        except Exception as e:
            print(e)
