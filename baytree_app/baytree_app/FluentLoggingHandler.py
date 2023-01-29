import logging

class FluentLoggingHandler:

    DEBUG = logging.DEBUG
    INFO = logging.INFO
    WARNING = logging.WARNING
    ERROR = logging.ERROR
    CRITICAL = logging.CRITICAL

    messageLogger = logging.getLogger("django_message")
    requestLogger = logging.getLogger("django.request")

    def __init__(self):
        pass
        # if os.environ.get("LOGGING_URL"):
        #     self.host = os.environ.get("LOGGING_URL")
        # else:
        #     self.host = "http://fluent-bit:24223/"
        # self.info_logger = logging.getLogger("django_message")

    # def sendLog(self, message):
    #     try:
    #         obj = {"log: ": message}
    #         requests.post(""+self.host, json=obj)
    #     except Exception as e:
    #         print(e)

    def sendInfoLog(self, message):
        pass
        # try:
        #     self.info_logger.setLevel(logging.INFO)
        #     #obj = {"log: ": message}
        #     self.info_logger.info(message)
        # except Exception as e:
        #     print(e)

    def writeRequestReceivedLog(self, request, message = {}):
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

    def writeResponseSentLog(self, response, message = {}):
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

    def writeMessageLog(self, message: str, loggingLevel: int):
        try:
            self.messageLogger.setLevel(loggingLevel)
            obj = {"log": {
                "message": message
            }}
            if loggingLevel == self.DEBUG:
                self.messageLogger.debug(obj)
            elif loggingLevel == self.WARNING:
                self.messageLogger.warning(obj)
            elif loggingLevel == self.ERROR:
                self.messageLogger.error(obj)
            elif loggingLevel == self.CRITICAL:
                self.messageLogger.critical(obj)
            else:
                # Default is INFO level
                self.messageLogger.info(obj)
        
        except Exception as e:
            print(e)