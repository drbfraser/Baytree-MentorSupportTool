
import os
# import requests
import logging

class FluentLoggingHandler:
    def __init__(self):
        # if os.environ.get("LOGGING_URL"):
        #     self.host = os.environ.get("LOGGING_URL")
        # else:
        #     self.host = "http://fluent-bit:24223/"
        self.info_logger = logging.getLogger("django_message")

    # def sendLog(self, message):
    #     try:
    #         obj = {"log: ": message}
    #         requests.post(""+self.host, json=obj)
    #     except Exception as e:
    #         print(e)

    def sendInfoLog(self, message):
        try:
            self.info_logger.setLevel(logging.INFO)
            #obj = {"log: ": message}
            self.info_logger.info(message)
        except Exception as e:
            print(e)

