
import os
import requests
from logging import StreamHandler
class FluentLoggingHandler:
    def __init__(self):
        self.host = os.environ["LOGGING_URL"]


    def sendLog(self, message):
        # try:
        print(self.host)
        obj = {"log:": message}
        requests.post(""+self.host, json=obj)
