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
        clientUrl = request.META.get('HTTP_REFERER')

        if url.startswith(views_base_url):
            source = "baytree"
            destination = "views" if views_base_url == "https://app.viewsapp.net/api/restful/" else "mock_views"
        else:
            # TO-DO: We need to distinguish between admin-frontend and frontend in a non-local environment
            source = "admin-frontend" if clientUrl == "http://localhost:3001/" else "frontend"
            destination = "baytree"

        params = {}
        if request.method == "GET":
            params = request.GET
        elif request.method == "POST":
            params = request.POST

        try:
            logJson = {"log": {
                "requestingUser": request.user,
                "method": request.method,
                "url": url,
                "params": params,
                "meta": {
                    "content_length": request.META["CONTENT_LENGTH"],
                    "http_accept": request.META["HTTP_ACCEPT"],
                    "http_referer": request.META["HTTP_REFERER"],
                    "query_string": request.META["QUERY_STRING"],
                    "server_name": request.META["SERVER_NAME"],
                    "server_port": request.META["SERVER_PORT"]
                },
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
        clientUrl = request.META.get('HTTP_REFERER')

        if url.startswith(views_base_url):
            source = "views" if views_base_url == "https://app.viewsapp.net/api/restful/" else "mock_views"
            destination = "baytree"
        else:
            source = "baytree"
            # TO-DO: We need to distinguish between admin-frontend and frontend in a non-local environment
            destination = "admin-frontend" if clientUrl == "http://localhost:3001/" else "frontend"

        try:
            logJson = {"log": {
                "url": url,
                "statusCode": response.status_code,
                "meta": {
                    "content-type": response.headers["Content-Type"]
                },
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
