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

    def debug(self, var_name="", var_val=None, file_path="", line_num=None, message=""):
        try:
            logJson = {"log": {
                "variable": var_name,
                "value": var_val,
                "file_path": file_path,
                "line_number": line_num,
                "message": message
            }}
            self.messageLogger.debug(logJson)
        except Exception as e:
            print(e)

    def req_info(self, url="", request_method="", data=None, message=""):
        try:
            logJson = {"log": {
                "url": url,
                "method": request_method,
                "data": data,
                "message": message
            }}
            self.messageLogger.info(logJson)
        except Exception as e:
            print(e)

    def res_info(self, status_code="", data=None, message=""):
        try:
            logJson = {"log": {
                "status": status_code,
                "data": data,
                "message": message
            }}
            self.messageLogger.info(logJson)
        except Exception as e:
            print(e)

    def warning(self, file_path="", line_num=None, message=""):
        try:
            logJson = {"log": {
                "file_path": file_path,
                "line_number": line_num,
                "message": message
            }}
            self.messageLogger.warning(logJson)
        except Exception as e:
            print(e)

    def error(self, file_path="", line_num=None, stack_trace="", message=""):
        try:
            logJson = {"log": {
                "file_path": file_path,
                "line_number": line_num,
                "stack_trace": stack_trace,
                "message": message
            }}
            self.messageLogger.error(logJson)
        except Exception as e:
            print(e)

    def critical(self, file_path="", line_num=None, stack_trace="", message=""):
        try:
            logJson = {"log": {
                "file_path": file_path,
                "line_number": line_num,
                "stack_trace": stack_trace,
                "message": message
            }}
            self.messageLogger.critical(logJson)
        except Exception as e:
            print(e)
