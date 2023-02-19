import logging


class FluentLoggingHandler:

    messageLogger = logging.getLogger("django_message")
    requestLogger = logging.getLogger("django.request")

    def __init__(self):
        pass

    def sendInfoLog(self, message):
        pass

    @staticmethod
    def logRequestSent(request, message="Request has been sent"):
        try:
            logJson = {"log": {
                "requestingUser": request.user,
                "url": request.path,
                "meta": request.META,
                "isRequestSentLog": True,
                "message": message
            }}
            FluentLoggingHandler.requestLogger.info(logJson)

        except Exception as e:
            print(e)

    @staticmethod
    def logViewsRequestSent(url="", data=None, message="Request has been sent to Views"):
        try:
            logJson = {"log": {
                "url": url,
                "data": data,
                "isRequestSentLog": True,
                "message": message
            }}
            FluentLoggingHandler.requestLogger.info(logJson)

        except Exception as e:
            print(e)

    @staticmethod
    def logResponseReceived(response, url="", message="Response has been received"):
        try:
            logJson = {"log": {
                "url": url,
                "meta": response.headers,
                "isRequestSentLog": False,
                "message": message
            }}
            if response.status_code < 400:
                FluentLoggingHandler.requestLogger.info(logJson)
            elif response.status_code < 600:
                FluentLoggingHandler.requestLogger.error(logJson)
            else:
                # Default is INFO level
                FluentLoggingHandler.requestLogger.info(logJson)

        except Exception as e:
            print(e)

    @staticmethod
    def debug(message=""):
        try:
            logJson = {"log": message}
            FluentLoggingHandler.messageLogger.debug(logJson)
        except Exception as e:
            print(e)

    @staticmethod
    def info(message=""):
        try:
            logJson = {"log": message}
            FluentLoggingHandler.messageLogger.info(logJson)
        except Exception as e:
            print(e)

    @staticmethod
    def warning(message=""):
        try:
            logJson = {"log": message}
            FluentLoggingHandler.messageLogger.warning(logJson)
        except Exception as e:
            print(e)

    @staticmethod
    def error(message=""):
        try:
            logJson = {"log": message}
            FluentLoggingHandler.messageLogger.error(logJson)
        except Exception as e:
            print(e)

    @staticmethod
    def critical(message=""):
        try:
            logJson = {"log": message}
            FluentLoggingHandler.messageLogger.critical(logJson)
        except Exception as e:
            print(e)
