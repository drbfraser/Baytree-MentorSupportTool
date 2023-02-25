import logging


class FluentLoggingHandler:

    messageLogger = logging.getLogger("django_message")
    requestLogger = logging.getLogger("django.request")

    def __init__(self):
        pass

    def sendInfoLog(self, message):
        pass

    @staticmethod
    def logRequestReceived(request, message="Request has been received"):
        try:
            logJson = {"log": {
                "requestingUser": request.user,
                "url": request.path,
                "meta": request.META,
                "isRequest": True,
                "destination": "baytree",
                "message": message,
            }}
            FluentLoggingHandler.requestLogger.info(logJson)

        except Exception as e:
            print(e)

    @staticmethod
    def logRequestReceivedByViews(url="", data=None, message="Request has been received by Views"):
        try:
            logJson = {"log": {
                "url": url,
                "data": data,
                "isRequest": True,
                "destination": "views",
                "message": message
            }}
            FluentLoggingHandler.requestLogger.info(logJson)

        except Exception as e:
            print(e)

    @staticmethod
    def logResponseSent(response, url="", message="Response has been sent"):
        try:
            logJson = {"log": {
                "url": url,
                "meta": response.headers,
                "isRequest": False,
                "source": "baytree",
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
    def logResponseSentFromViews(response, url="", message="Response has been sent from Views"):
        try:
            logJson = {"log": {
                "url": url,
                "meta": response.headers,
                "isRequest": False,
                "source": "views",
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
