import logging

class FluentLoggingHandler:

    messageLogger = logging.getLogger("django_message")
    requestLogger = logging.getLogger("django.request")

    def __init__(self):
        pass

    def sendInfoLog(self, message):
        pass

    def logRequestReceived(self, request, message = {}):
        try:
            obj = {"log": {
                "requestingUser": request.user,
                "meta": request.META,
                "requestReceived": True,
                "message": message
            }}
            self.requestLogger.info(obj)
        
        except Exception as e:
            print(e)

    def logResponseSent(self, response, message = {}):
        try:
            obj = {"log": {
                "meta": response.headers,
                "requestReceived": False,
                "message": message
            }}
            if response.status_code < 400:
                self.requestLogger.info(obj)
            elif response.status_code < 600:
                self.requestLogger.error(obj)
            else:
                # Default is INFO level
                self.requestLogger.info(obj)
        
        except Exception as e:
            print(e)

    def logDebugMessage(self, message):
        try:
            obj = {"log": {
                "message": message
            }}
            self.messageLogger.debug(obj)
        except Exception as e:
            print(e)

    def logInfoMessage(self, message):
        try:
            obj = {"log": {
                "message": message
            }}
            self.messageLogger.info(obj)
        except Exception as e:
            print(e)

    def logWarningMessage(self, message):
        try:
            obj = {"log": {
                "message": message
            }}
            self.messageLogger.warning(obj)
        except Exception as e:
            print(e)

    def logErrorMessage(self, message):
        try:
            obj = {"log": {
                "message": message
            }}
            self.messageLogger.error(obj)
        except Exception as e:
            print(e)

    def logCriticalMessage(self, message):
        try:
            obj = {"log": {
                "message": message
            }}
            self.messageLogger.critical(obj)
        except Exception as e:
            print(e)