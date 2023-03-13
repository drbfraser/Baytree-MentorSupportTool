import logging
import os

views_base_url = os.environ["VIEWS_BASE_URL"]


class FluentLoggingHandler:

    messageLogger = logging.getLogger("django_message")
    requestLogger = logging.getLogger("django.request")

    def __init__(self):
        pass

    def sendInfoLog(self, message):
        pass

    @staticmethod
    def logRequest(request, message="Logging request"):
        url = request.build_absolute_uri()
        source = ""
        destination = ""

        if url.startswith(views_base_url):
            source = "baytree"
            destination = "views" if views_base_url == "https://app.viewsapp.net/api/restful/" else "mock_views"
        else:
            source = "client"
            destination = "baytree"

        try:
            logJson = {"log": {
                "requestingUser": request.user,
                "method": request.method,
                "url": url,
                "meta": request.META,
                "isRequest": True,
                "source": source,
                "destination": destination,
                "message": message,
            }}
            FluentLoggingHandler.requestLogger.info(logJson)

        except Exception as e:
            print(e)

    @staticmethod
    def logResponse(response, request, message="Logging response"):
        url = request.build_absolute_uri()
        source = ""
        destination = ""

        if url.startswith(views_base_url):
            source = "views" if views_base_url == "https://app.viewsapp.net/api/restful/" else "mock_views"
            destination = "baytree"
        else:
            source = "baytree"
            destination = "client"

        try:
            logJson = {"log": {
                "url": url,
                "meta": response.headers,
                "isRequest": False,
                "source": source,
                "destination": destination,
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
    def logAction(request, message="Logging Action"):
        action = ""
        if request.method == "GET":
            action = "Read"
        elif request.method == "POST":
            action = "Create"
        elif request.method == "PUT":
            action = "Update"
        else:
            action = "Delete"

        try:
            logJson = {"log": {
                "performingUser": request.user,
                "operation": action,
                "message": message
            }}
            FluentLoggingHandler.messageLogger.info(logJson)
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
