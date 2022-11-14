import json
import logging
from logging.handlers import SocketHandler

from socket import *

client=socket(AF_INET, SOCK_STREAM)
print("1")
client.connect(("127.0.0.1", 24224))
print("2")
string = {"test" : 123} # AFTER IT doesn't appear on fluent bit
client.sendall(json.dumps(string).encode())

client.close()

# format = '%(asctime)s [%(levelname)s] %(funcName)s %(process)d %(message)s'
#
# logger = logging.getLogger('tcpserver')
# socket_handler = SocketHandler("localhost", 24224)
#
# logger.addHandler(socket_handler)
# print("hi")
# logger.info("Hello Log!")
# logger.warning("Hello Log!")